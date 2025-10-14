// domain/use-case/UpdateEventUseCase.js
export class UpdateEventUseCase {
  constructor(eventRepository) {
    this.eventRepository = eventRepository;
  }

  async execute(id, data) {
    return await this.eventRepository.updateEvent(id, data);
  }
}