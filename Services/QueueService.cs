using System.Collections.Concurrent;
using System.Collections.Generic;

namespace SoundAnnoucementApp.Services
{
    // public class QueueService
    // {
    //     private Queue<string> _queue = new Queue<string>();

    //     public void Enqueue(string item)
    //     {
    //         _queue.Enqueue(item);
    //     }

    //     public string Dequeue()
    //     {
    //         return _queue.Count > 0 ? _queue.Dequeue() : null;
    //     }

    //     public int Count()
    //     {
    //         return _queue.Count;
    //     }

    // }
    public class QueueService
    {
        private readonly ConcurrentQueue<string> _queue = new ConcurrentQueue<string>();

        public int Count() => _queue.Count;

        public void Enqueue(string item)
        {
            _queue.Enqueue(item);
        }

        public bool TryDequeue(out string result)
        {
            return _queue.TryDequeue(out result);
        }

        public IEnumerable<string> GetAll()
        {
            return _queue.ToArray();
        }

        public bool Remove(string item)
        {
            // Since ConcurrentQueue doesn't support direct removal,
            // we need to recreate the queue without the item
            var items = _queue.ToList();
            bool removed = items.Remove(item);
            
            if (removed)
            {
                _queue.Clear();
                foreach (var remainingItem in items)
                {
                    _queue.Enqueue(remainingItem);
                }
            }
            
            return removed;
        }

        public void Clear()
        {
            _queue.Clear();
        }
    }
}