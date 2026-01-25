// Automatically sort resource cards alphabetically within each section
function sortResourceCards() {
  const kanbanColumns = document.querySelectorAll('.kanban-column');
  
  if (kanbanColumns.length === 0) return;
  
  kanbanColumns.forEach(column => {
    // Get all resource card links in this column
    const cards = Array.from(column.querySelectorAll('a.resource-card-link'));
    
    if (cards.length === 0) return;
    
    // Extract title from each card and sort
    const sortedCards = cards.sort((a, b) => {
      const getTitleText = (card) => {
        const h4 = card.querySelector('h4');
        if (!h4) return '';
        // Get text content and remove emojis/HTML
        const text = h4.textContent.trim();
        return text.toLowerCase();
      };
      
      const titleA = getTitleText(a);
      const titleB = getTitleText(b);
      
      return titleA.localeCompare(titleB);
    });
    
    // Reorder the cards in the DOM
    sortedCards.forEach(card => {
      column.appendChild(card);
    });
  });
}

// Run on page load and on content changes (for MkDocs navigation)
document.addEventListener('DOMContentLoaded', sortResourceCards);
document.addEventListener('load', sortResourceCards);

// Also run after a short delay for dynamic content
setTimeout(sortResourceCards, 100);
setTimeout(sortResourceCards, 500);

// Watch for mutations in case content is dynamically loaded
const observer = new MutationObserver(sortResourceCards);
observer.observe(document.body, {
  childList: true,
  subtree: true,
  attributes: false
});
