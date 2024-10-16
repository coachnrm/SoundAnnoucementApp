using System.Collections.Generic;

namespace SoundAnnoucementApp.Services
{
    public class QueueService
    {
        private Queue<string> _queue = new Queue<string>();

        public void Enqueue(string item)
        {
            _queue.Enqueue(item);
        }

        public string Dequeue()
        {
            return _queue.Count > 0 ? _queue.Dequeue() : null;
        }

        public int Count()
        {
            return _queue.Count;
        }
    }
}