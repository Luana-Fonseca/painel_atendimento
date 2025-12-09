// SCRIPTS.JS - VERSÃO FUNCIONAL
console.log('🎉 scripts.js CARREGADO COM SUCESSO!');

// Criar TicketSystem global
window.TicketSystem = {
    versao: '2.0',
    
    init: function() {
        console.log('✅ TicketSystem.init() executado');
        
        // Carregar dados
        this.loadFromStorage();
        
        // Configurar eventos
        this.setupEvents();
        
        // Atualizar interface
        this.updateUI();
        
        // Mostrar alerta visual
        this.showAlert('Sistema de Tickets carregado!', 'success');
        
        return this;
    },
    
    loadFromStorage: function() {
        try {
            const data = localStorage.getItem('ticketSystem');
            if (data) {
                const parsed = JSON.parse(data);
                this.tickets = parsed.tickets || [];
                this.currentTicket = parsed.currentTicket || null;
                console.log(`📊 ${this.tickets.length} tickets carregados`);
            }
        } catch (e) {
            console.error('Erro ao carregar:', e);
        }
    },
    
    setupEvents: function() {
        console.log('🔧 Configurando eventos...');
        
        // Formulário de emissão
        const form = document.getElementById('formEmissaoTicket');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.emitir();
            });
        }
        
        // Botão "Apenas Emitir"
        const btnEmitir = document.getElementById('btnApenasEmitir');
        if (btnEmitir) {
            btnEmitir.addEventListener('click', () => {
                this.emitir(false);
            });
        }
    },
    
    emitir: function(chamar = true) {
        const tipo = document.getElementById('tipoTicket')?.value;
        const guiche = document.getElementById('guicheAtendimento')?.value;
        
        if (!tipo) {
            this.showAlert('Selecione um tipo de atendimento!', 'warning');
            return;
        }
        
        // Criar ticket
        const ticket = {
            id: `${tipo}-${Math.floor(Math.random() * 900 + 100)}`,
            tipo: tipo,
            guiche: guiche || '4',
            timestamp: new Date().toLocaleTimeString(),
            status: chamar ? 'chamando' : 'aguardando'
        };
        
        // Adicionar à lista
        this.tickets = this.tickets || [];
        this.tickets.unshift(ticket);
        this.currentTicket = ticket;
        
        // Salvar
        this.saveToStorage();
        
        // Atualizar UI
        this.updateUI();
        
        // Mostrar alerta
        this.showAlert(`Ticket ${ticket.id} emitido para Guichê ${ticket.guiche}!`, 'success');
        
        // Chamar se necessário
        if (chamar) {
            this.chamar(ticket);
        }
        
        return ticket;
    },
    
    chamar: function(ticket) {
        ticket.status = 'chamando';
        localStorage.setItem('currentTicket', JSON.stringify(ticket));
        this.saveToStorage();
        this.updateUI();
        this.showAlert(`CHAMANDO: ${ticket.id} para Guichê ${ticket.guiche}`, 'info');
    },
    
    updateUI: function() {
        // Último ticket
        const ultimoEl = document.getElementById('ultimoTicket');
        if (ultimoEl && this.currentTicket) {
            const t = this.currentTicket;
            ultimoEl.innerHTML = `
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <span class="badge bg-primary fs-6">${t.id}</span>
                        <div class="mt-2">
                            <small class="text-muted">
                                <i class="bi bi-geo-alt"></i> Guichê ${t.guiche}
                            </small>
                        </div>
                    </div>
                    <span class="badge bg-info">${t.status}</span>
                </div>
            `;
        }
        
        // Estatísticas
        const totalEl = document.getElementById('totalTickets');
        if (totalEl) totalEl.textContent = this.tickets?.length || 0;
        
        const esperaEl = document.getElementById('ticketsEspera');
        if (esperaEl) {
            const emEspera = this.tickets?.filter(t => t.status === 'aguardando').length || 0;
            esperaEl.textContent = emEspera;
        }
    },
    
    showAlert: function(message, type = 'info') {
        console.log(`📢 ${type}: ${message}`);
        
        // Criar alerta visual
        const alertDiv = document.createElement('div');
        alertDiv.innerHTML = `
            <div class="alert alert-${type}" style="
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 9999;
                min-width: 300px;
                padding: 15px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                animation: slideInRight 0.3s ease;
            ">
                <strong>${type.toUpperCase()}:</strong> ${message}
                <button onclick="this.parentElement.remove()" style="
                    float: right;
                    background: none;
                    border: none;
                    font-size: 1.2em;
                    cursor: pointer;
                ">×</button>
            </div>
        `;
        
        document.body.appendChild(alertDiv);
        
        // Remover após 5 segundos
        setTimeout(() => {
            if (alertDiv.parentNode) alertDiv.remove();
        }, 5000);
    },
    
    saveToStorage: function() {
        localStorage.setItem('ticketSystem', JSON.stringify({
            tickets: this.tickets || [],
            currentTicket: this.currentTicket
        }));
    }
};

// Inicializar automaticamente
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM carregado - scripts.js');
    
    // Pequeno delay para garantir
    setTimeout(() => {
        if (typeof TicketSystem !== 'undefined') {
            console.log('🚀 Inicializando TicketSystem...');
            TicketSystem.init();
        } else {
            console.error('❌ TicketSystem não encontrado!');
        }
    }, 100);
});

console.log('✅ scripts.js finalizado. TicketSystem:', typeof TicketSystem);