// 1. Sistema de cobrança engessado
class SistemaCobrancaStripe {
    cobrar(usuarioId: string, valorTokens: number): void {
        console.log(`Cobrando R$${valorTokens} via Stripe do usuário ${usuarioId}`);
    }
}

// 2. Serviço dedicado à cobrança
class ServicoCobranca {
    constructor(private gatewayCobranca: SistemaCobrancaStripe) {}

    registrarCobranca(usuarioId: string, valor: number): void {
        this.gatewayCobranca.cobrar(usuarioId, valor);
    }
}

// 3. Contrato para cada tipo de geração de IA
interface GeradorIA {
    tipo: string;
    gerar(prompt: string): string;
}

class GeradorTexto implements GeradorIA {
    public tipo = "TEXTO";

    gerar(prompt: string): string {
        return `[Texto Gerado]: Respondendo ao prompt: ${prompt}`;
    }
}

class GeradorImagem implements GeradorIA {
    public tipo = "IMAGEM";

    gerar(prompt: string): string {
        return `[Imagem Gerada]: URL da imagem baseada em: ${prompt}`;
    }
}

class GeradorAudio implements GeradorIA {
    public tipo = "AUDIO";

    gerar(prompt: string): string {
        return `[Áudio Gerado]: Arquivo de voz para: ${prompt}`;
    }
}

// 4. A classe principal que orquestra requisições de IA
class AssistenteOmniIA {
    public nomeModelo: string;
    private servicoCobranca: ServicoCobranca;
    private geradores: Map<string, GeradorIA>;

    constructor(nomeModelo: string, servicoCobranca: ServicoCobranca, geradores: GeradorIA[]) {
        this.nomeModelo = nomeModelo;
        this.servicoCobranca = servicoCobranca;
        this.geradores = new Map(geradores.map((gerador) => [gerador.tipo, gerador]));
    }

    processarRequisicaoUsuario(prompt: string, tipo: string): void {
        console.log(`Iniciando processamento com ${this.nomeModelo}...`);

        const gerador = this.geradores.get(tipo);

        if (!gerador) {
            throw new Error("Tipo de IA não suportado pelo sistema.");
        }

        gerador.gerar(prompt);
       
        this.servicoCobranca.registrarCobranca("user_999", 1.50);
    }
}

// 5. Um modelo específico sendo forçado a herdar o que não deve
class ModeloFocadoEmTexto extends AssistenteOmniIA {
    constructor(servicoCobranca: ServicoCobranca) {
        super("ChatGPT-4", servicoCobranca, [new GeradorTexto()]);
    }
}
