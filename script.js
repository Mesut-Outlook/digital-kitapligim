// Global Variables
let booksData = [];
let authorsData = {};
let filteredBooks = [];
let currentView = 'grid';
let currentPage = 1;
const booksPerPage = 100; // Daha büyük veri seti için artırdık

// DOM Elements
const elements = {
    searchInput: document.getElementById('searchInput'),
    clearSearch: document.getElementById('clearSearch'),
    genreFilter: document.getElementById('genreFilter'),
    sortBy: document.getElementById('sortBy'),
    viewBtns: document.querySelectorAll('.view-btn'),
    booksGrid: document.getElementById('booksGrid'),
    authorsGrid: document.getElementById('authorsGrid'),
    authorsSection: document.getElementById('authorsSection'),
    loading: document.getElementById('loading'),
    noResults: document.getElementById('noResults'),
    resultsCount: document.getElementById('resultsCount'),
    totalBooks: document.getElementById('totalBooks'),
    totalAuthors: document.getElementById('totalAuthors'),
    totalGenres: document.getElementById('totalGenres'),
    bookModal: document.getElementById('bookModal'),
    modalClose: document.getElementById('modalClose'),
    modalTitle: document.getElementById('modalTitle'),
    modalAuthor: document.getElementById('modalAuthor'),
    modalGenre: document.getElementById('modalGenre'),
    modalFileType: document.getElementById('modalFileType'),
    modalDate: document.getElementById('modalDate'),
    scrollToTop: document.getElementById('scrollToTop'),
    modalFilePath: document.getElementById('modalFilePath'),
    copyPathBtn: document.getElementById('copyPathBtn'),
    openFolderBtn: document.getElementById('openFolderBtn')
};

// Utility Functions
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

const createBookCard = (book) => {
    const bookCard = document.createElement('div');
    bookCard.className = 'book-card';
    bookCard.setAttribute('data-aos', 'fade-up');
    
    const gradients = [
        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
        'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
        'linear-gradient(135deg, #ff8a80 0%, #ea4c89 100%)'
    ];
    
    const randomGradient = gradients[Math.floor(Math.random() * gradients.length)];
    
    // Dosya uzantısından tür tahmini
    const getGenreFromExtension = (extension, title) => {
        const ext = (extension || '').toLowerCase();
        const titleLower = (title || '').toLowerCase();
        
        if (titleLower.includes('çocuk') || titleLower.includes('masal')) return 'Çocuk';
        if (titleLower.includes('tarih')) return 'Tarih';
        if (titleLower.includes('felsefe') || titleLower.includes('düşünce')) return 'Felsefe';
        if (titleLower.includes('roman') || titleLower.includes('aşk')) return 'Roman';
        if (titleLower.includes('bilim') || titleLower.includes('uzay')) return 'Bilim Kurgu';
        if (titleLower.includes('polisiye') || titleLower.includes('cinayet')) return 'Polisiye';
        if (titleLower.includes('şiir')) return 'Şiir';
        if (titleLower.includes('din') || titleLower.includes('islam')) return 'Din';
        
        switch (ext) {
            case 'pdf': return 'Akademik';
            case 'epub': return 'Roman';
            case 'mobi': return 'E-Kitap';
            case 'txt': return 'Metin';
            default: return 'Genel';
        }
    };
    
    const genre = getGenreFromExtension(book.fileExtension, book.title);
    
    bookCard.innerHTML = `
        <div class="book-cover" style="background: ${randomGradient}">
            <i class="fas fa-book"></i>
        </div>
        <div class="book-info">
            <h3 class="book-title" title="${book.title}">${book.title}</h3>
            <p class="book-author">${book.author || 'Bilinmeyen Yazar'}</p>
            <div class="book-meta">
                <span class="book-genre">${genre}</span>
                <span class="book-type">${book.fileExtension || 'TXT'}</span>
            </div>
        </div>
    `;
    
    bookCard.addEventListener('click', () => showBookModal({...book, genre}));
    return bookCard;
};

const createAuthorCard = (authorName, authorBooks) => {
    const authorCard = document.createElement('div');
    authorCard.className = 'author-card';
    authorCard.setAttribute('data-aos', 'fade-up');
    
    // Yazar kitaplarından tür tahmini
    const getGenresFromBooks = (books) => {
        const genres = new Set();
        books.forEach(book => {
            const ext = (book.fileExtension || '').toLowerCase();
            const titleLower = (book.title || '').toLowerCase();
            
            if (titleLower.includes('çocuk') || titleLower.includes('masal')) genres.add('Çocuk');
            else if (titleLower.includes('tarih')) genres.add('Tarih');
            else if (titleLower.includes('felsefe') || titleLower.includes('düşünce')) genres.add('Felsefe');
            else if (titleLower.includes('roman') || titleLower.includes('aşk')) genres.add('Roman');
            else if (titleLower.includes('bilim') || titleLower.includes('uzay')) genres.add('Bilim Kurgu');
            else if (titleLower.includes('polisiye') || titleLower.includes('cinayet')) genres.add('Polisiye');
            else if (titleLower.includes('şiir')) genres.add('Şiir');
            else if (titleLower.includes('din') || titleLower.includes('islam')) genres.add('Din');
            else if (ext === 'pdf') genres.add('Akademik');
            else if (ext === 'epub') genres.add('Roman');
            else genres.add('Genel');
        });
        return Array.from(genres);
    };
    
    const genres = getGenresFromBooks(authorBooks);
    const genreTags = genres.slice(0, 3).map(genre => 
        `<span class="genre-tag">${genre}</span>`
    ).join('');
    
    authorCard.innerHTML = `
        <div class="author-name">${authorName || 'Bilinmeyen Yazar'}</div>
        <div class="author-books-count">${authorBooks.length} kitap</div>
        <div class="author-genres">${genreTags}</div>
    `;
    
    authorCard.addEventListener('click', () => filterByAuthor(authorName));
    return authorCard;
};

const showBookModal = (book) => {
    elements.modalTitle.textContent = book.title;
    elements.modalAuthor.textContent = book.author || 'Bilinmeyen Yazar';
    elements.modalGenre.textContent = book.genre || getGenreFromBook(book);
    elements.modalFileType.textContent = book.fileExtension || 'TXT';
    elements.modalDate.textContent = formatDate(book.addedDate);
    elements.modalFilePath.textContent = book.filePath || 'Dosya yolu bulunamadı';
    
    // Store current book for actions
    elements.bookModal.currentBook = book;
    
    elements.bookModal.classList.add('active');
    document.body.style.overflow = 'hidden';
};

const hideBookModal = () => {
    elements.bookModal.classList.remove('active');
    document.body.style.overflow = 'auto';
};

const filterByAuthor = (authorName) => {
    elements.searchInput.value = authorName;
    elements.authorsSection.style.display = 'none';
    performSearch();
    elements.searchInput.scrollIntoView({ behavior: 'smooth' });
};

const performSearch = () => {
    const searchTerm = elements.searchInput.value.toLowerCase().trim();
    const selectedGenre = elements.genreFilter.value;
    
    filteredBooks = booksData.filter(book => {
        // Tür tahmini
        const getGenreFromBook = (book) => {
            const ext = (book.fileExtension || '').toLowerCase();
            const titleLower = (book.title || '').toLowerCase();
            
            if (titleLower.includes('çocuk') || titleLower.includes('masal')) return 'Çocuk';
            if (titleLower.includes('tarih')) return 'Tarih';
            if (titleLower.includes('felsefe') || titleLower.includes('düşünce')) return 'Felsefe';
            if (titleLower.includes('roman') || titleLower.includes('aşk')) return 'Roman';
            if (titleLower.includes('bilim') || titleLower.includes('uzay')) return 'Bilim Kurgu';
            if (titleLower.includes('polisiye') || titleLower.includes('cinayet')) return 'Polisiye';
            if (titleLower.includes('şiir')) return 'Şiir';
            if (titleLower.includes('din') || titleLower.includes('islam')) return 'Din';
            
            switch (ext) {
                case 'pdf': return 'Akademik';
                case 'epub': return 'Roman';
                case 'mobi': return 'E-Kitap';
                case 'txt': return 'Metin';
                default: return 'Genel';
            }
        };
        
        const bookGenre = getGenreFromBook(book);
        
        const matchesSearch = !searchTerm || 
            book.title.toLowerCase().includes(searchTerm) ||
            (book.author && book.author.toLowerCase().includes(searchTerm)) ||
            bookGenre.toLowerCase().includes(searchTerm);
            
        const matchesGenre = !selectedGenre || bookGenre === selectedGenre;
        
        return matchesSearch && matchesGenre;
    });
    
    // Show/hide clear search button
    elements.clearSearch.style.display = searchTerm ? 'block' : 'none';
    
    // Show/hide authors section based on search
    elements.authorsSection.style.display = searchTerm ? 'none' : 'block';
    
    sortAndDisplayBooks();
};

const sortAndDisplayBooks = () => {
    const sortBy = elements.sortBy.value;
    
    filteredBooks.sort((a, b) => {
        switch (sortBy) {
            case 'title':
                return a.title.localeCompare(b.title, 'tr');
            case 'author':
                return (a.author || '').localeCompare(b.author || '', 'tr');
            case 'genre':
                return (a.genre || '').localeCompare(b.genre || '', 'tr');
            case 'date':
                return new Date(b.addedDate) - new Date(a.addedDate);
            default:
                return 0;
        }
    });
    
    displayBooks();
};

const displayBooks = () => {
    elements.resultsCount.textContent = `${filteredBooks.length} kitap gösteriliyor`;
    
    if (filteredBooks.length === 0) {
        elements.booksGrid.style.display = 'none';
        elements.noResults.style.display = 'block';
        return;
    }
    
    elements.booksGrid.style.display = 'grid';
    elements.noResults.style.display = 'none';
    
    // Clear existing books
    elements.booksGrid.innerHTML = '';
    
    // Add view class
    elements.booksGrid.className = `books-grid ${currentView === 'list' ? 'list-view' : ''}`;
    
    // Display books with pagination
    const startIndex = (currentPage - 1) * booksPerPage;
    const endIndex = Math.min(startIndex + booksPerPage, filteredBooks.length);
    
    for (let i = startIndex; i < endIndex; i++) {
        const bookCard = createBookCard(filteredBooks[i]);
        elements.booksGrid.appendChild(bookCard);
    }
    
    // Implement infinite scroll if there are more books
    if (endIndex < filteredBooks.length) {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                currentPage++;
                loadMoreBooks();
                observer.disconnect();
            }
        });
        
        // Observe the last book card
        const lastCard = elements.booksGrid.lastElementChild;
        if (lastCard) {
            observer.observe(lastCard);
        }
    }
};

const loadMoreBooks = () => {
    const startIndex = (currentPage - 1) * booksPerPage;
    const endIndex = Math.min(startIndex + booksPerPage, filteredBooks.length);
    
    for (let i = startIndex; i < endIndex; i++) {
        const bookCard = createBookCard(filteredBooks[i]);
        elements.booksGrid.appendChild(bookCard);
    }
    
    // Continue infinite scroll if there are more books
    if (endIndex < filteredBooks.length) {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                currentPage++;
                loadMoreBooks();
                observer.disconnect();
            }
        });
        
        const lastCard = elements.booksGrid.lastElementChild;
        if (lastCard) {
            observer.observe(lastCard);
        }
    }
};

const displayAuthors = () => {
    elements.authorsGrid.innerHTML = '';
    
    // Sort authors by book count
    const sortedAuthors = Object.entries(authorsData)
        .sort(([,a], [,b]) => b.length - a.length)
        .slice(0, 100); // Daha fazla yazar göster
    
    sortedAuthors.forEach(([authorName, books]) => {
        const authorCard = createAuthorCard(authorName, books);
        elements.authorsGrid.appendChild(authorCard);
    });
};

const populateGenreFilter = () => {
    // Tüm kitaplardan türleri tahmin et
    const genres = new Set();
    
    booksData.forEach(book => {
        const ext = (book.fileExtension || '').toLowerCase();
        const titleLower = (book.title || '').toLowerCase();
        
        if (titleLower.includes('çocuk') || titleLower.includes('masal')) genres.add('Çocuk');
        else if (titleLower.includes('tarih')) genres.add('Tarih');
        else if (titleLower.includes('felsefe') || titleLower.includes('düşünce')) genres.add('Felsefe');
        else if (titleLower.includes('roman') || titleLower.includes('aşk')) genres.add('Roman');
        else if (titleLower.includes('bilim') || titleLower.includes('uzay')) genres.add('Bilim Kurgu');
        else if (titleLower.includes('polisiye') || titleLower.includes('cinayet')) genres.add('Polisiye');
        else if (titleLower.includes('şiir')) genres.add('Şiir');
        else if (titleLower.includes('din') || titleLower.includes('islam')) genres.add('Din');
        else if (ext === 'pdf') genres.add('Akademik');
        else if (ext === 'epub') genres.add('Roman');
        else if (ext === 'mobi') genres.add('E-Kitap');
        else if (ext === 'txt') genres.add('Metin');
        else genres.add('Genel');
    });
    
    const sortedGenres = Array.from(genres).sort((a, b) => a.localeCompare(b, 'tr'));
    
    elements.genreFilter.innerHTML = '<option value="">Tüm Türler</option>';
    sortedGenres.forEach(genre => {
        const option = document.createElement('option');
        option.value = genre;
        option.textContent = genre;
        elements.genreFilter.appendChild(option);
    });
};

const updateStats = () => {
    const uniqueAuthors = new Set(booksData.map(book => book.author).filter(Boolean));
    
    // Tahmin edilen türleri say
    const genres = new Set();
    booksData.forEach(book => {
        const ext = (book.fileExtension || '').toLowerCase();
        const titleLower = (book.title || '').toLowerCase();
        
        if (titleLower.includes('çocuk') || titleLower.includes('masal')) genres.add('Çocuk');
        else if (titleLower.includes('tarih')) genres.add('Tarih');
        else if (titleLower.includes('felsefe') || titleLower.includes('düşünce')) genres.add('Felsefe');
        else if (titleLower.includes('roman') || titleLower.includes('aşk')) genres.add('Roman');
        else if (titleLower.includes('bilim') || titleLower.includes('uzay')) genres.add('Bilim Kurgu');
        else if (titleLower.includes('polisiye') || titleLower.includes('cinayet')) genres.add('Polisiye');
        else if (titleLower.includes('şiir')) genres.add('Şiir');
        else if (titleLower.includes('din') || titleLower.includes('islam')) genres.add('Din');
        else if (ext === 'pdf') genres.add('Akademik');
        else if (ext === 'epub') genres.add('Roman');
        else if (ext === 'mobi') genres.add('E-Kitap');
        else if (ext === 'txt') genres.add('Metin');
        else genres.add('Genel');
    });
    
    elements.totalBooks.textContent = booksData.length.toLocaleString('tr-TR');
    elements.totalAuthors.textContent = uniqueAuthors.size.toLocaleString('tr-TR');
    elements.totalGenres.textContent = genres.size.toLocaleString('tr-TR');
};

const parseCSV = (csvText) => {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',').map(header => header.trim().replace(/"/g, ''));
    const books = [];
    
    for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim()) {
            const values = [];
            let currentValue = '';
            let insideQuotes = false;
            
            for (let j = 0; j < lines[i].length; j++) {
                const char = lines[i][j];
                
                if (char === '"') {
                    insideQuotes = !insideQuotes;
                } else if (char === ',' && !insideQuotes) {
                    values.push(currentValue.trim());
                    currentValue = '';
                } else {
                    currentValue += char;
                }
            }
            values.push(currentValue.trim());
            
            if (values.length >= headers.length) {
                const book = {};
                headers.forEach((header, index) => {
                    book[header] = values[index] ? values[index].replace(/"/g, '') : '';
                });
                
                if (book.title && book.title.trim()) {
                    books.push(book);
                }
            }
        }
    }
    
    return books;
};

const loadBooks = async () => {
    try {
        elements.loading.style.display = 'block';
        elements.booksGrid.style.display = 'none';
        elements.authorsSection.style.display = 'none';
        
        // Sırayla denenecek dosyalar
        const filesToTry = [
            { url: 'kitaplar.zip', type: 'zip', description: 'Ana veritabanı (sıkıştırılmış)' },
            { url: 'sample_kitaplar.csv', type: 'csv', description: 'Örnek veritabanı' }
        ];
        
        let csvText;
        let loadedFrom = '';
        
        for (const file of filesToTry) {
            try {
                console.log(`${file.description} deneniyor: ${file.url}`);
                
                if (file.type === 'zip') {
                    const zipResponse = await fetch(file.url);
                    if (zipResponse.ok) {
                        const zipBlob = await zipResponse.blob();
                        csvText = await extractCSVFromZip(zipBlob);
                        loadedFrom = file.description;
                        break;
                    }
                } else {
                    const csvResponse = await fetch(file.url);
                    if (csvResponse.ok) {
                        csvText = await csvResponse.text();
                        loadedFrom = file.description;
                        break;
                    }
                }
            } catch (fileError) {
                console.log(`${file.description} yüklenemedi:`, fileError);
                continue;
            }
        }
        
        if (!csvText) {
            throw new Error('Hiçbir veri dosyası yüklenemedi');
        }
        
        booksData = parseCSV(csvText);
        
        // Group books by author
        authorsData = {};
        booksData.forEach(book => {
            const author = book.author || 'Bilinmeyen Yazar';
            if (!authorsData[author]) {
                authorsData[author] = [];
            }
            authorsData[author].push(book);
        });
        
        filteredBooks = [...booksData];
        
        // Initialize UI
        populateGenreFilter();
        updateStats();
        displayAuthors();
        displayBooks();
        
        elements.loading.style.display = 'none';
        elements.authorsSection.style.display = 'block';
        
        // Başarı mesajı göster
        if (loadedFrom.includes('Örnek')) {
            showToast('Örnek veritabanı yüklendi. Kendi CSV dosyanızı ekleyebilirsiniz.', 'info');
        } else {
            showToast(`${loadedFrom} başarıyla yüklendi (${booksData.length.toLocaleString('tr-TR')} kitap)`, 'success');
        }
        
    } catch (error) {
        console.error('Hata:', error);
        elements.loading.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            <span>Kitaplar yüklenirken bir hata oluştu: ${error.message}</span>
            <div style="margin-top: 1rem; font-size: 0.9rem; color: var(--text-light);">
                <p>Muhtemel çözümler:</p>
                <ul style="text-align: left; margin-top: 0.5rem;">
                    <li>Sayfayı yenileyin (F5)</li>
                    <li>İnternet bağlantınızı kontrol edin</li>
                    <li>Birkaç dakika sonra tekrar deneyin</li>
                    <li>Tarayıcı cache'ini temizleyin</li>
                </ul>
                <p style="margin-top: 1rem;">
                    <strong>Not:</strong> Site örnek verilerle çalışabilir, ana veritabanı yüklenene kadar bekleyin.
                </p>
            </div>
        `;
    }
};

// ZIP dosyasından CSV çıkarma fonksiyonu
const extractCSVFromZip = async (zipBlob) => {
    // JSZip kütüphanesini dinamik olarak yükle
    if (!window.JSZip) {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
        document.head.appendChild(script);
        
        // Script yüklenene kadar bekle
        await new Promise((resolve, reject) => {
            script.onload = resolve;
            script.onerror = reject;
        });
    }
    
    const zip = await JSZip.loadAsync(zipBlob);
    const csvFile = Object.keys(zip.files).find(name => name.endsWith('.csv'));
    
    if (!csvFile) {
        throw new Error('ZIP içinde CSV dosyası bulunamadı');
    }
    
    return await zip.files[csvFile].async('text');
};

// Event Listeners
const initEventListeners = () => {
    // Search functionality
    elements.searchInput.addEventListener('input', debounce(performSearch, 300));
    elements.clearSearch.addEventListener('click', () => {
        elements.searchInput.value = '';
        elements.clearSearch.style.display = 'none';
        elements.authorsSection.style.display = 'block';
        performSearch();
    });
    
    // Filter functionality
    elements.genreFilter.addEventListener('change', performSearch);
    elements.sortBy.addEventListener('change', sortAndDisplayBooks);
    
    // View toggle
    elements.viewBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            elements.viewBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentView = btn.dataset.view;
            currentPage = 1;
            displayBooks();
        });
    });
    
    // Modal functionality
    elements.modalClose.addEventListener('click', hideBookModal);
    elements.bookModal.addEventListener('click', (e) => {
        if (e.target === elements.bookModal) {
            hideBookModal();
        }
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            hideBookModal();
        }
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            elements.searchInput.focus();
        }
    });
    
    // Scroll to top button
    elements.scrollToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    // Show/hide scroll to top button
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            elements.scrollToTop.classList.add('visible');
        } else {
            elements.scrollToTop.classList.remove('visible');
        }
    });
    
    // Search input focus
    elements.searchInput.addEventListener('focus', () => {
        elements.searchInput.select();
    });
    
    // Logo click - return to home
    document.querySelector('.logo').addEventListener('click', () => {
        resetToHomePage();
    });
    
    // Header stats clicks
    elements.totalBooks.parentElement.addEventListener('click', () => {
        showAllBooks();
    });
    
    elements.totalAuthors.parentElement.addEventListener('click', () => {
        showAuthorsView();
    });
    
    elements.totalGenres.parentElement.addEventListener('click', () => {
        showGenresView();
    });
    
    // File path actions
    elements.copyPathBtn.addEventListener('click', () => {
        copyFilePath();
    });
    
    elements.openFolderBtn.addEventListener('click', () => {
        openFileFolder();
    });
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    initEventListeners();
    loadBooks();
});

// Add keyboard shortcut info to search placeholder
elements.searchInput.placeholder = 'Kitap adı, yazar veya türe göre ara... (Ctrl+K)';

// Add some smooth animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Performance optimization: Virtual scrolling for large datasets
const createVirtualScrolling = () => {
    if (booksData.length > 1000) {
        console.log('Büyük veri seti için virtual scrolling aktif');
        // Virtual scrolling implementation would go here
    }
};

// Add search suggestions
const addSearchSuggestions = () => {
    const datalist = document.createElement('datalist');
    datalist.id = 'search-suggestions';
    
    const uniqueValues = new Set();
    booksData.forEach(book => {
        if (book.title) uniqueValues.add(book.title);
        if (book.author) uniqueValues.add(book.author);
        if (book.genre) uniqueValues.add(book.genre);
    });
    
    Array.from(uniqueValues).slice(0, 100).forEach(value => {
        const option = document.createElement('option');
        option.value = value;
        datalist.appendChild(option);
    });
    
    document.body.appendChild(datalist);
    elements.searchInput.setAttribute('list', 'search-suggestions');
};

// Navigation functions
const resetToHomePage = () => {
    // Clear search
    elements.searchInput.value = '';
    elements.clearSearch.style.display = 'none';
    
    // Reset filters
    elements.genreFilter.value = '';
    elements.sortBy.value = 'title';
    
    // Show authors section
    elements.authorsSection.style.display = 'block';
    
    // Reset to all books
    filteredBooks = [...booksData];
    currentPage = 1;
    
    // Display everything fresh
    displayBooks();
    displayAuthors();
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Show success message
    showToast('Ana sayfaya döndünüz', 'success');
};

const showAllBooks = () => {
    // Clear search and filters
    elements.searchInput.value = '';
    elements.clearSearch.style.display = 'none';
    elements.genreFilter.value = '';
    
    // Hide authors section
    elements.authorsSection.style.display = 'none';
    
    // Show all books
    filteredBooks = [...booksData];
    elements.sortBy.value = 'title';
    currentPage = 1;
    
    sortAndDisplayBooks();
    
    // Scroll to books section
    document.querySelector('.books-section').scrollIntoView({ behavior: 'smooth' });
    
    // Show success message
    showToast(`Tüm ${booksData.length.toLocaleString('tr-TR')} kitap gösteriliyor`, 'info');
};

const showAuthorsView = () => {
    // Clear search
    elements.searchInput.value = '';
    elements.clearSearch.style.display = 'none';
    elements.genreFilter.value = '';
    
    // Show authors section
    elements.authorsSection.style.display = 'block';
    
    // Hide books temporarily and show authors
    elements.booksGrid.style.display = 'none';
    
    // Scroll to authors section
    elements.authorsSection.scrollIntoView({ behavior: 'smooth' });
    
    // Show success message
    const authorCount = Object.keys(authorsData).length;
    showToast(`${authorCount.toLocaleString('tr-TR')} yazar gösteriliyor`, 'info');
    
    // Show books again after a short delay
    setTimeout(() => {
        elements.booksGrid.style.display = 'grid';
        filteredBooks = [...booksData];
        currentPage = 1;
        displayBooks();
    }, 1000);
};

const showGenresView = () => {
    // Create a modal showing all genres
    const genreModal = document.createElement('div');
    genreModal.className = 'modal active';
    genreModal.innerHTML = `
        <div class="modal-content" style="max-width: 600px;">
            <div class="modal-header">
                <h3><i class="fas fa-tags"></i> Kitap Türleri</h3>
                <button class="modal-close" onclick="this.closest('.modal').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="genres-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem;">
                    ${generateGenreCards()}
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(genreModal);
    document.body.style.overflow = 'hidden';
    
    // Close modal when clicking outside
    genreModal.addEventListener('click', (e) => {
        if (e.target === genreModal) {
            genreModal.remove();
            document.body.style.overflow = 'auto';
        }
    });
};

const generateGenreCards = () => {
    // Count books by genre
    const genreCounts = {};
    
    booksData.forEach(book => {
        const genre = getGenreFromBook(book);
        genreCounts[genre] = (genreCounts[genre] || 0) + 1;
    });
    
    // Sort by count
    const sortedGenres = Object.entries(genreCounts)
        .sort(([,a], [,b]) => b - a);
    
    return sortedGenres.map(([genre, count]) => `
        <div class="genre-card" onclick="filterByGenre('${genre}')" style="
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            color: white;
            padding: 1.5rem;
            border-radius: var(--border-radius);
            text-align: center;
            cursor: pointer;
            transition: var(--transition);
        " onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
            <h4 style="margin: 0 0 0.5rem 0; font-size: 1.1rem;">${genre}</h4>
            <p style="margin: 0; opacity: 0.9; font-size: 0.9rem;">${count.toLocaleString('tr-TR')} kitap</p>
        </div>
    `).join('');
};

const getGenreFromBook = (book) => {
    const ext = (book.fileExtension || '').toLowerCase();
    const titleLower = (book.title || '').toLowerCase();
    
    if (titleLower.includes('çocuk') || titleLower.includes('masal')) return 'Çocuk';
    if (titleLower.includes('tarih')) return 'Tarih';
    if (titleLower.includes('felsefe') || titleLower.includes('düşünce')) return 'Felsefe';
    if (titleLower.includes('roman') || titleLower.includes('aşk')) return 'Roman';
    if (titleLower.includes('bilim') || titleLower.includes('uzay')) return 'Bilim Kurgu';
    if (titleLower.includes('polisiye') || titleLower.includes('cinayet')) return 'Polisiye';
    if (titleLower.includes('şiir')) return 'Şiir';
    if (titleLower.includes('din') || titleLower.includes('islam')) return 'Din';
    
    switch (ext) {
        case 'pdf': return 'Akademik';
        case 'epub': return 'Roman';
        case 'mobi': return 'E-Kitap';
        case 'txt': return 'Metin';
        default: return 'Genel';
    }
};

const filterByGenre = (genre) => {
    // Close modal
    document.querySelector('.modal')?.remove();
    document.body.style.overflow = 'auto';
    
    // Set genre filter
    elements.genreFilter.value = genre;
    elements.searchInput.value = '';
    elements.clearSearch.style.display = 'none';
    
    // Hide authors section
    elements.authorsSection.style.display = 'none';
    
    // Perform search
    performSearch();
    
    // Scroll to books
    document.querySelector('.books-section').scrollIntoView({ behavior: 'smooth' });
    
    // Show success message
    showToast(`${genre} kategorisi gösteriliyor`, 'success');
};

// Toast notification system
const showToast = (message, type = 'info') => {
    // Remove existing toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: var(--border-radius);
        box-shadow: var(--shadow-lg);
        z-index: 1001;
        animation: slideIn 0.3s ease-out;
        max-width: 300px;
        font-size: 0.9rem;
        font-weight: 500;
    `;
    
    toast.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
    
    // Add CSS animations if not exists
    if (!document.querySelector('#toast-styles')) {
        const style = document.createElement('style');
        style.id = 'toast-styles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
};

// File path operations
const copyFilePath = async () => {
    const book = elements.bookModal.currentBook;
    if (!book || !book.filePath) {
        showToast('Dosya yolu bulunamadı', 'error');
        return;
    }
    
    try {
        await navigator.clipboard.writeText(book.filePath);
        showToast('Dosya yolu kopyalandı', 'success');
    } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = book.filePath;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            showToast('Dosya yolu kopyalandı', 'success');
        } catch (err) {
            showToast('Kopyalama başarısız', 'error');
        }
        
        document.body.removeChild(textArea);
    }
};

const openFileFolder = () => {
    const book = elements.bookModal.currentBook;
    if (!book || !book.filePath) {
        showToast('Dosya yolu bulunamadı', 'error');
        return;
    }
    
    // Extract folder path from file path
    const folderPath = book.filePath.substring(0, book.filePath.lastIndexOf('\\'));
    
    // Try to open folder (this works in desktop applications, limited in browsers)
    try {
        // For Windows
        if (navigator.userAgent.indexOf('Windows') !== -1) {
            // This won't work in browser for security reasons, but show the path
            showFolderPathModal(folderPath);
        } else {
            showFolderPathModal(folderPath);
        }
    } catch (err) {
        showFolderPathModal(folderPath);
    }
};

const showFolderPathModal = (folderPath) => {
    const folderModal = document.createElement('div');
    folderModal.className = 'modal active';
    folderModal.innerHTML = `
        <div class="modal-content" style="max-width: 600px;">
            <div class="modal-header">
                <h3><i class="fas fa-folder"></i> Klasör Yolu</h3>
                <button class="modal-close" onclick="this.closest('.modal').remove(); document.body.style.overflow = 'auto';">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <p style="margin-bottom: 1rem; color: var(--text-secondary);">
                    Güvenlik nedeniyle tarayıcıdan klasör açılamaz. Aşağıdaki yolu kopyalayıp dosya yöneticisinde açabilirsiniz:
                </p>
                <div class="file-path" style="margin-bottom: 1rem;">
                    ${folderPath}
                </div>
                <div class="path-actions">
                    <button class="path-btn" onclick="copyFolderPath('${folderPath.replace(/'/g, "\\'")}')">
                        <i class="fas fa-copy"></i> Klasör Yolunu Kopyala
                    </button>
                    <button class="path-btn" onclick="copyExplorerCommand('${folderPath.replace(/'/g, "\\'")}')">
                        <i class="fas fa-terminal"></i> Explorer Komutu
                    </button>
                </div>
                <div style="margin-top: 1rem; padding: 1rem; background: var(--bg-tertiary); border-radius: var(--border-radius); font-size: 0.875rem;">
                    <strong>İpucu:</strong> Windows'ta "Windows + R" tuşlarına basıp yukarıdaki yolu yapıştırabilir veya 
                    Explorer komutunu kopyalayıp Command Prompt'ta çalıştırabilirsiniz.
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(folderModal);
    
    // Close modal when clicking outside
    folderModal.addEventListener('click', (e) => {
        if (e.target === folderModal) {
            folderModal.remove();
            document.body.style.overflow = 'auto';
        }
    });
};

// Global functions for folder modal buttons
window.copyFolderPath = async (path) => {
    try {
        await navigator.clipboard.writeText(path);
        showToast('Klasör yolu kopyalandı', 'success');
    } catch (err) {
        showToast('Kopyalama başarısız', 'error');
    }
};

window.copyExplorerCommand = async (path) => {
    const command = `explorer "${path}"`;
    try {
        await navigator.clipboard.writeText(command);
        showToast('Explorer komutu kopyalandı', 'success');
    } catch (err) {
        showToast('Kopyalama başarısız', 'error');
    }
};