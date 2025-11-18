document.addEventListener('DOMContentLoaded', () => {
    const notepadArea = document.getElementById('notepad-area');

    // Load saved content from localStorage
    const savedContent = localStorage.getItem('notepadContent');
    if (savedContent) {
        notepadArea.value = savedContent;
    }

    // Save content to localStorage on input
    notepadArea.addEventListener('input', () => {
        localStorage.setItem('notepadContent', notepadArea.value);
    });
});
