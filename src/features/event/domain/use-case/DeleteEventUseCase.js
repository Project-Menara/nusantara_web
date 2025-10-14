// domain/use-case/DeleteEventUseCase.js
export class DeleteEventUseCase {
  constructor(eventRepository) {
    this.eventRepository = eventRepository;
  }

  async execute(id) {
    return await this.eventRepository.deleteEvent(id);
  }
}