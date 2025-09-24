import EventForm from '@/components/forms/EventForm';

export default function NewEventPage() {
  return (
    <main className="p-6">
      <h1 className="text-xl font-bold mb-4">Tambah Event</h1>
      <EventForm />
    </main>
  );
}
