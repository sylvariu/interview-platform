import {Controller, Get, Param, UseGuards} from "@nestjs/common";
import {TopicService} from "./topic.service";
import {JwtGuard} from "../auth/guards/auth.guard";

@UseGuards(JwtGuard)
@Controller('topics')
export class TopicController {
    constructor(private readonly topicService: TopicService) {}

    @Get('sections')
    getSections() {
        return this.topicService.getSectionsGrouped();
    }

    @Get('children/:id')
    getChildren(@Param('id') id: string) {
        return this.topicService.getChildren(id);
    }

    @Get(':id')
    getOne(@Param('id') id: string) {
        return this.topicService.getById(id);
    }
}