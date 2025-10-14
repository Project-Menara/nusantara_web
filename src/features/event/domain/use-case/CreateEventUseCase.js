// domain/use-case/CreateEventUseCase.js
export class CreateEventUseCase {
  constructor(eventRepository) {
    this.eventRepository = eventRepository;
  }

  async execute(data) {
    return await this.eventRepository.createEvent(data);
  }
}