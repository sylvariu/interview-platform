import {Controller, Get, Req, Param, Post, UseGuards} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import {JwtGuard} from "../auth/guards/auth.guard";

@Controller('favorites')
@UseGuards(JwtGuard)
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  getUserFavorites(@Req() req) {
    return this.favoritesService.getUserFavorites(req.user.id);
  }

  @Get(':problemId')
  isFavorite(@Param('problemId') problemId: string, @Req() req) {
    return this.favoritesService.isFavorite(req.user.id, problemId);
  }

  @Post(':problemId')
  toggleFavorite(@Param('problemId') problemId, @Req() req) {
    return this.favoritesService.toggleFavorite(req.user.id, problemId);
  }
}
