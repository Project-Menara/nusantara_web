// domain/use-case/UpdateEventStatusUseCase.js
export class UpdateEventStatusUseCase {
  constructor(eventRepository) {
    this.eventRepository = eventRepository;
  }

  async execute(id, status) {
    return await this.eventRepository.updateEventStatus(id, status);
  }
}