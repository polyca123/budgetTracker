let db
const request = indexedDB.open('budget', 1)

request.onupgradeneeded = ({ target }) => {
  db = target.result
  db.createObjectStore('pending', {autoIncrement: true})
}

request.onsuccess = ({ target }) => {
  db = target.result

  if (navigator.onLine) {
    checkDatabase()
  }
}

const saveRecord = record => {
  const transaction = db.transaction(['pending'], 'readwrite')
  const store = transaction.objectStore('pending')
  store.add(record)
}

const checkDatabase = () => {
  const transaction = db.transaction(['pending'], 'readwrite')
  const store = transaction.objectStore('pending')
  const getAll = store.getAll()

  getAll.onsuccess = () => {
    if (getAll.results.length > 0) {
      axios.post('/api/transaction/bulk', getAll.result, {
        
      })
      .then(() => {
        const transaction = db.transaction(['pending'], 'readwrite')
        const store = transaction.objectStore('pending')
        store.clear()
      })
    }
  }
}

window.addEventListener('online', checkDatabase)