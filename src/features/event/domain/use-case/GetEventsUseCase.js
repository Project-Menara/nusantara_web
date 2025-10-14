// domain/use-case/GetEventsUseCase.js
export class GetEventsUseCase {
  constructor(eventRepository) {
    this.eventRepository = eventRepository;
  }

  async execute(params) {
    return await this.eventRepository.getEvents(params);
  }
}