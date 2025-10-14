// domain/use-case/GetEventByIdUseCase.js
export class GetEventByIdUseCase {
  constructor(eventRepository) {
    this.eventRepository = eventRepository;
  }

  async execute(id) {
    return await this.eventRepository.getEventById(id);
  }
}