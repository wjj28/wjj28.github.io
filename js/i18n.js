// EN / PT switch. The pages are written in English; this swaps the visible
// text for Portuguese using the table below (English text -> Portuguese).
// Anything not in the table simply stays as it is.
(function () {
    var PT = {
        // menus
        'ABOUT ME': 'SOBRE MIM',
        'GET IN TOUCH': 'CONTACTO',
        'MORE ABOUT ME': 'MAIS SOBRE MIM',
        'More about me': 'Mais sobre mim',
        'Get in touch': 'Contacto',

        // home
        'Hey there! 👋🏾': 'Olá! 👋🏾',
        "I'm Willy": 'Sou o Willy',
        'Ten islands in the Atlantic, nine of them inhabited. “Morabeza” is our word for warm hospitality.':
            'Dez ilhas no Atlântico, nove delas habitadas. “Morabeza” é a nossa palavra para a arte de bem receber.',
        'Football': 'Futebol',
        "The islands' favourite sport: every region has its own league, and the champions meet for the national title.":
            'O desporto favorito das ilhas: cada região tem o seu campeonato, e os campeões disputam o título nacional.',
        "Cabo Verde's national team, the Blue Sharks, reached its first World Cup in 2026.":
            'A seleção de Cabo Verde, os Tubarões Azuis, chegou ao seu primeiro Mundial em 2026.',
        'Basketball · ARBSS': 'Basquetebol · ARBSS',
        'The Associação Regional de Basquetebol de Santiago Sul runs basketball in the Praia region.':
            'A Associação Regional de Basquetebol de Santiago Sul organiza o basquetebol na região da Praia.',
        'Named after Monty Python, not the snake. It is the language I reach for first.':
            'O nome vem dos Monty Python, não da cobra. É a primeira linguagem a que recorro.',
        'Technology · EllaLink': 'Tecnologia · EllaLink',
        'A submarine cable linking Europe and South America passes right by us, with a branch landing in Praia.':
            'Um cabo submarino que liga a Europa à América do Sul passa mesmo ao nosso lado, com um ramal que amarra na Praia.',
        'Europe ↗': 'Europa ↗',
        '↙ Brazil': '↙ Brasil',
        'I teach Git and GitHub from zero, in Portuguese.': 'Ensino Git e GitHub do zero, em português.',
        'Research': 'Investigação',
        'I write about Python for research: Matplotlib, LaTeX and Jupyter.':
            'Escrevo sobre Python para investigação: Matplotlib, LaTeX e Jupyter.',

        // about
        'WHO AM I?': 'QUEM SOU EU?',
        'From the islands of Cabo-Verde but spent a great deal in China':
            'Das ilhas de Cabo Verde, mas com muitos anos vividos na China',
        'A Computer Scientist, passionate about building communities.':
            'Cientista da computação, apaixonado por criar comunidades.',
        'A Dog lover with a deep interest in History, the human kind':
            'Amigo dos cães, com um interesse profundo pela História da humanidade',
        'Always up for coffee and katxupa': 'Sempre pronto para um café e uma katxupa',
        "Where I've studied & worked": 'Onde estudei e trabalhei',
        'Work': 'Trabalho',
        'Studies': 'Estudos',
        'Now': 'Atual',
        'App Developer & Data Systems Analyst': 'Programador de Apps e Analista de Sistemas de Dados',
        'Software Engineer': 'Engenheiro de Software',
        'Chinese Language & Literature': 'Língua e Literatura Chinesas',
        'MEng, Computer Science': 'Mestrado em Ciência da Computação',
        'BSc, Computer Science': 'Licenciatura em Ciência da Computação',
        'Co-Director, startup community': 'Codiretor, comunidade de startups',
        'Teaching Assistant, ML course': 'Professor assistente, Machine Learning',
        'Automation & Data Developer (remote)': 'Programador de Automação e Dados (remoto)',
        'Belo Horizonte, MG · Brazil': 'Belo Horizonte, MG · Brasil',
        'The name means “beach” in Portuguese. It is the capital, on the island of Santiago.':
            'É a capital do país e fica na ilha de Santiago, a maior do arquipélago.',
        'The name means “upon the sea”; its port is the world\'s busiest for containers.':
            'O nome significa “sobre o mar”; o seu porto é o mais movimentado do mundo.',
        'The name means “southern capital”; several dynasties ruled China from here.':
            'O nome significa “capital do sul”; várias dinastias governaram a China a partir daqui.',
        'Its Ming-dynasty city wall is one of the longest still standing in the world.':
            'A sua muralha da dinastia Ming é uma das mais longas ainda de pé no mundo.',
        'The name means “beautiful horizon”; it was one of Brazil\'s first planned cities.':
            'Foi uma das primeiras cidades planeadas do Brasil.',

        // studa ku mi
        'Open study material and articles — Git, Python, Jupyter and data science, from zero to research.':
            'Material de estudo aberto e artigos — Git, Python, Jupyter e ciência de dados, do zero à investigação.',
        'Free course': 'Curso gratuito',
        'A hands-on course for people who have never coded or opened a terminal — from creating your account to pull requests.':
            'Um curso prático para quem nunca programou nem abriu um terminal — da criação da conta aos pull requests.',
        '11 modules': '11 módulos',
        '11 modules · ~17 h · CC BY 4.0': '11 módulos · ~17 h · CC BY 4.0',
        'Open repo': 'Abrir repositório',
        'Medium · English': 'Medium · Inglês',
        'Installation 📕': 'Instalação 📕',
        'Install Python and Jupyter Notebook for your research ⏬':
            'Instala o Python e o Jupyter Notebook para a tua investigação ⏬',
        '#Installation⚒': '#Instalação⚒',
        '2 articles': '2 artigos',
        '5 articles': '5 artigos',
        'From zero': 'Do zero',
        'More on Medium': 'Mais no Medium',
        'Python Basics 📘': 'Bases de Python 📘',
        "Let's get to know a bit more about Python🐍 and Jupyter Notebook and how to use them! 😁👊🏾":
            'Vamos conhecer um pouco melhor o Python🐍 e o Jupyter Notebook, e como usá-los! 😁👊🏾',
        '#Coding 👩🏿‍💻': '#Programação 👩🏿‍💻',
        'Jupyter & Research 📙': 'Jupyter e Investigação 📙',
        'Short articles about libraries and techniques to help you on your research🔬':
            'Artigos curtos sobre bibliotecas e técnicas de investigação🔬',
        '#Research 👩🏿‍💻': '#Investigação 👩🏿‍💻',
        'Libraries and techniques': 'Bibliotecas e técnicas',

        // contact
        "LET'S TALK": 'VAMOS CONVERSAR',
        'Always open to discussing data, technology and new opportunities.':
            'Sempre disponível para falar de dados, tecnologia e novas oportunidades.',
        'Your Name': 'Nome',
        'Your Email': 'Email',
        'Message': 'Mensagem',
        "What's on your mind?": 'Em que estás a pensar?',
        'Send Message': 'Enviar mensagem'
    };

    var ATTRS = ['data-tip', 'placeholder', 'aria-label'];
    var nodes = [];     // { node, en, pt }
    var attrs = [];     // { el, name, en, pt }

    function collect() {
        var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        var node;
        while ((node = walker.nextNode())) {
            if (node.parentNode.closest('script, style')) continue;
            var key = node.nodeValue.replace(/\s+/g, ' ').trim();
            if (PT[key]) {
                // keep the spaces around the text so the layout does not shift
                nodes.push({ node: node, en: node.nodeValue, pt: node.nodeValue.replace(node.nodeValue.trim(), PT[key]) });
            }
        }
        ATTRS.forEach(function (name) {
            document.querySelectorAll('[' + name + ']').forEach(function (el) {
                var value = el.getAttribute(name);
                if (PT[value]) attrs.push({ el: el, name: name, en: value, pt: PT[value] });
            });
        });
    }

    function apply(lang) {
        nodes.forEach(function (item) { item.node.nodeValue = item[lang]; });
        attrs.forEach(function (item) { item.el.setAttribute(item.name, item[lang]); });
        document.documentElement.lang = lang;
        if (button) {
            button.textContent = lang === 'pt' ? 'EN' : 'PT';
            button.setAttribute('aria-label', lang === 'pt' ? 'Switch to English' : 'Mudar para português');
        }
        window.dispatchEvent(new Event('resize'));      // the character re-measures the page
    }

    function saved() {
        try { return localStorage.getItem('lang'); } catch (e) { return null; }
    }

    var lang = saved() || ((navigator.language || '').toLowerCase().indexOf('pt') === 0 ? 'pt' : 'en');

    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'lang-switch';
    button.addEventListener('click', function () {
        lang = lang === 'pt' ? 'en' : 'pt';
        try { localStorage.setItem('lang', lang); } catch (e) { /* private mode: just don't remember */ }
        apply(lang);
    });
    var nav = document.querySelector('header nav');
    var hamburger = nav && nav.querySelector('.hamburger');
    if (nav) nav.insertBefore(button, hamburger);

    collect();
    apply(lang);
})();
