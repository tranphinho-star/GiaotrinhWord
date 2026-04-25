/* ==========================================
   NOTES SYSTEM - Ghi chú cho mỗi chương
   ========================================== */

class NotesManager {
  constructor(pageId) {
    this.pageId = pageId;
    this.storageKey = `word_textbook_notes_${pageId}`;
    this.notes = this.loadNotes();
    this.container = null;
  }

  loadNotes() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch { return []; }
  }

  saveNotes() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.notes));
  }

  addNote(text) {
    if (!text.trim()) return;
    const note = {
      id: Date.now(),
      text: text.trim(),
      createdAt: new Date().toISOString()
    };
    this.notes.unshift(note);
    this.saveNotes();
    this.render();
  }

  deleteNote(id) {
    this.notes = this.notes.filter(n => n.id !== id);
    this.saveNotes();
    this.render();
  }

  formatDate(iso) {
    const d = new Date(iso);
    const pad = n => String(n).padStart(2, '0');
    return `${pad(d.getDate())}/${pad(d.getMonth()+1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  render() {
    if (!this.container) return;
    const listEl = this.container.querySelector('.notes-list');
    const countEl = this.container.querySelector('.notes-count');
    
    countEl.textContent = this.notes.length;

    if (this.notes.length === 0) {
      listEl.innerHTML = '<div class="notes-empty">📝 Chưa có ghi chú nào. Hãy thêm ghi chú đầu tiên!</div>';
      return;
    }

    listEl.innerHTML = this.notes.map(note => `
      <div class="note-item" data-id="${note.id}">
        <div class="note-header">
          <span class="note-time">🕐 ${this.formatDate(note.createdAt)}</span>
          <button class="note-delete" onclick="notesManager.deleteNote(${note.id})" title="Xóa ghi chú">✕</button>
        </div>
        <div class="note-text">${note.text.replace(/</g,'&lt;').replace(/\n/g,'<br>')}</div>
      </div>
    `).join('');
  }

  init(containerEl) {
    this.container = containerEl;
    this.render();
  }
}

// Auto-init when DOM ready
document.addEventListener('DOMContentLoaded', () => {
  const section = document.getElementById('notes-section');
  if (!section) return;
  
  const pageId = section.dataset.page || window.location.pathname.split('/').pop().replace('.html','');
  window.notesManager = new NotesManager(pageId);
  notesManager.init(section);

  // Handle form submit
  const form = section.querySelector('.notes-form');
  const textarea = section.querySelector('.notes-input');
  form.addEventListener('submit', e => {
    e.preventDefault();
    notesManager.addNote(textarea.value);
    textarea.value = '';
    textarea.style.height = 'auto';
  });

  // Auto-resize textarea
  textarea.addEventListener('input', () => {
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
  });
});
