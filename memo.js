document.addEventListener('DOMContentLoaded', () => {
    const memoForm = document.getElementById('memo-form');
    const memoBoard = document.getElementById('memo-board');
    const paginationControls = document.getElementById('pagination-controls'); // New element for pagination
    let memos = JSON.parse(localStorage.getItem('memos')) || [];

    const memosPerPage = 10;
    let currentPage = 1;

    const saveMemos = () => {
        localStorage.setItem('memos', JSON.stringify(memos));
    };

    const renderMemosToBoard = () => {
        memoBoard.innerHTML = '';
        const startIndex = (currentPage - 1) * memosPerPage;
        const endIndex = startIndex + memosPerPage;
        const memosToDisplay = memos.slice(startIndex, endIndex);

        memosToDisplay.forEach((memo, relativeIndex) => {
            const absoluteIndex = startIndex + relativeIndex; // Calculate absolute index
            const memoDiv = document.createElement('div');
            memoDiv.className = 'memo-item';

            memoDiv.innerHTML = `
                <button class="accordion-btn">${absoluteIndex + 1}. ${memo.title}</button>
                <div class="accordion-panel">
                    <p>${memo.content}</p>
                    <div class="actions">
                        <button class="edit-btn" data-index="${absoluteIndex}">수정</button>
                        <button class="delete-btn" data-index="${absoluteIndex}">삭제</button>
                    </div>
                </div>
            `;
            memoBoard.appendChild(memoDiv);
        });
    };

    const renderPagination = () => {
        if (!paginationControls) return; // Ensure paginationControls exists
        paginationControls.innerHTML = '';
        const totalPages = Math.ceil(memos.length / memosPerPage);

        if (totalPages <= 1) return; // No pagination needed for 1 or less pages

        // Previous button
        const prevButton = document.createElement('button');
        prevButton.textContent = '이전';
        prevButton.disabled = currentPage === 1;
        prevButton.addEventListener('click', () => {
            currentPage--;
            renderMemosToBoard();
            renderPagination();
        });
        paginationControls.appendChild(prevButton);

        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement('button');
            pageButton.textContent = i;
            pageButton.classList.toggle('active', i === currentPage);
            pageButton.addEventListener('click', () => {
                currentPage = i;
                renderMemosToBoard();
                renderPagination();
            });
            paginationControls.appendChild(pageButton);
        }

        // Next button
        const nextButton = document.createElement('button');
        nextButton.textContent = '다음';
        nextButton.disabled = currentPage === totalPages;
        nextButton.addEventListener('click', () => {
            currentPage++;
            renderMemosToBoard();
            renderPagination();
        });
        paginationControls.appendChild(nextButton);
    };

    // Logic for board.html
    if (memoBoard) {
        memoBoard.addEventListener('click', (e) => {
            if (e.target.classList.contains('accordion-btn')) {
                e.target.classList.toggle('active');
                const panel = e.target.nextElementSibling;
                if (panel.style.maxHeight) {
                    panel.style.maxHeight = null;
                } else {
                    panel.style.maxHeight = panel.scrollHeight + "px";
                }
            }

            if (e.target.classList.contains('delete-btn')) {
                const index = parseInt(e.target.dataset.index); // Get absolute index
                memos.splice(index, 1);
                saveMemos();
                // Adjust currentPage if the last memo on a page was deleted
                const totalPages = Math.ceil(memos.length / memosPerPage);
                if (currentPage > totalPages && totalPages > 0) {
                    currentPage = totalPages;
                } else if (totalPages === 0) {
                    currentPage = 1; // Reset to page 1 if no memos left
                }
                renderMemosToBoard();
                renderPagination();
            }

            if (e.target.classList.contains('edit-btn')) {
                const index = parseInt(e.target.dataset.index); // Get absolute index
                const newTitle = prompt('새 제목:', memos[index].title);
                const newContent = prompt('새 내용:', memos[index].content);

                if (newTitle !== null && newTitle.trim() !== '' && newContent !== null && newContent.trim() !== '') {
                    memos[index] = { title: newTitle.trim(), content: newContent.trim() };
                    saveMemos();
                    renderMemosToBoard();
                    renderPagination();
                }
            }
        });

        // Initial render for board.html
        renderMemosToBoard();
        renderPagination();
    }

    // Logic for memo.html
    if (memoForm) {
        const memoTitleInput = document.getElementById('memo-title');
        const memoInput = document.getElementById('memo-input');
        memoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const newMemo = {
                title: memoTitleInput.value.trim(),
                content: memoInput.value.trim()
            };
            if (newMemo.title && newMemo.content) {
                memos.push(newMemo);
                saveMemos();
                window.location.href = 'board.html'; // Redirect to board
            }
        });
    }
});
