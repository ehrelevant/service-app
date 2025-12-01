import { and, eq } from 'drizzle-orm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { portfolio, portfolioImage, provider, service, user } from '@repo/database';

import { DatabaseService } from '../database/database.service';

import { AddPortfolioImageDto } from './dto/add-portfolio-image.dto';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';

@Injectable()
export class PortfoliosService {
  constructor(private readonly dbService: DatabaseService) {}

  async createPortfolio(createPortfolioDto: CreatePortfolioDto) {
    // Verify service exists and belongs to provider if specified
    const [existingService] = await this.dbService.db
      .select()
      .from(service)
      .where(eq(service.id, createPortfolioDto.serviceId));

    if (!existingService) {
      throw new NotFoundException('Service not found');
    }

    // Create portfolio
    const [newPortfolio] = await this.dbService.db
      .insert(portfolio)
      .values({
        serviceId: createPortfolioDto.serviceId,
        description: createPortfolioDto.description,
      })
      .returning();

    // Add images if provided
    if (createPortfolioDto.images && createPortfolioDto.images.length > 0) {
      const imageInserts = createPortfolioDto.images.map(imageUrl => ({
        portfolioId: newPortfolio.id,
        image: imageUrl,
      }));

      await this.dbService.db.insert(portfolioImage).values(imageInserts);
    }

    return await this.getPortfolioById(newPortfolio.id);
  }

  async getAllPortfolios() {
    const portfolios = await this.dbService.db
      .select({
        id: portfolio.id,
        description: portfolio.description,
        service: {
          id: service.id,
          initialCost: service.initialCost,
          serviceTypeId: service.serviceTypeId,
        },
        provider: {
          userId: provider.userId,
          firstName: user.firstName,
          lastName: user.lastName,
          avatarUrl: user.avatarUrl,
        },
      })
      .from(portfolio)
      .leftJoin(service, eq(portfolio.serviceId, service.id))
      .leftJoin(provider, eq(service.providerUserId, provider.userId))
      .leftJoin(user, eq(provider.userId, user.id));

    // Get images for each portfolio
    const portfoliosWithImages = await Promise.all(
      portfolios.map(async portfolioItem => {
        const images = await this.dbService.db
          .select({ image: portfolioImage.image })
          .from(portfolioImage)
          .where(eq(portfolioImage.portfolioId, portfolioItem.id));

        return {
          ...portfolioItem,
          images: images.map(img => img.image),
        };
      }),
    );

    return portfoliosWithImages;
  }

  async getPortfolioById(id: string) {
    const [foundPortfolio] = await this.dbService.db
      .select({
        id: portfolio.id,
        description: portfolio.description,
        service: {
          id: service.id,
          initialCost: service.initialCost,
          serviceTypeId: service.serviceTypeId,
        },
        provider: {
          userId: provider.userId,
          firstName: user.firstName,
          lastName: user.lastName,
          avatarUrl: user.avatarUrl,
        },
      })
      .from(portfolio)
      .leftJoin(service, eq(portfolio.serviceId, service.id))
      .leftJoin(provider, eq(service.providerUserId, provider.userId))
      .leftJoin(user, eq(provider.userId, user.id))
      .where(eq(portfolio.id, id));

    if (!foundPortfolio) {
      throw new NotFoundException(`Portfolio with ID ${id} not found`);
    }

    // Get portfolio images
    const images = await this.dbService.db
      .select({ image: portfolioImage.image })
      .from(portfolioImage)
      .where(eq(portfolioImage.portfolioId, id));

    return {
      ...foundPortfolio,
      images: images.map(img => img.image),
    };
  }

  async updatePortfolio(id: string, updatePortfolioDto: UpdatePortfolioDto) {
    const [updatedPortfolio] = await this.dbService.db
      .update(portfolio)
      .set(updatePortfolioDto)
      .where(eq(portfolio.id, id))
      .returning();

    if (!updatedPortfolio) {
      throw new NotFoundException(`Portfolio with ID ${id} not found`);
    }

    return await this.getPortfolioById(id);
  }

  async deletePortfolio(id: string) {
    // Delete portfolio images first
    await this.dbService.db.delete(portfolioImage).where(eq(portfolioImage.portfolioId, id));

    // Delete portfolio
    const [deletedPortfolio] = await this.dbService.db.delete(portfolio).where(eq(portfolio.id, id)).returning();

    if (!deletedPortfolio) {
      throw new NotFoundException(`Portfolio with ID ${id} not found`);
    }

    return { message: 'Portfolio deleted successfully' };
  }

  async addPortfolioImage(id: string, addImageDto: AddPortfolioImageDto) {
    await this.dbService.db.insert(portfolioImage).values({
      portfolioId: id,
      image: addImageDto.image,
    });

    return await this.getPortfolioById(id);
  }

  async removePortfolioImage(portfolioId: string, imageUrl: string) {
    const [deletedImage] = await this.dbService.db
      .delete(portfolioImage)
      .where(and(eq(portfolioImage.portfolioId, portfolioId), eq(portfolioImage.image, imageUrl)))
      .returning();

    if (!deletedImage) {
      throw new NotFoundException('Image not found in portfolio');
    }

    return { message: 'Image removed successfully' };
  }
}
