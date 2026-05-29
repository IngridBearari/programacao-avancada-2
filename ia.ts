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

// 3. Contratos segregados por capacidade
interface GeradorIA {
    tipo: string;
    gerar(prompt: string): string;
}

interface GeradorTextoIA extends GeradorIA {
    gerarTexto(prompt: string): string;
}

interface GeradorImagemIA extends GeradorIA {
    gerarImagem(prompt: string): string;
}

interface GeradorAudioIA extends GeradorIA {
    gerarAudio(prompt: string): string;
}

class GeradorTexto implements GeradorTextoIA {
    public tipo = "TEXTO";

    gerarTexto(prompt: string): string {
        return `[Texto Gerado]: Respondendo ao prompt: ${prompt}`;
    }

    gerar(prompt: string): string {
        return this.gerarTexto(prompt);
    }
}

class GeradorImagem implements GeradorImagemIA {
    public tipo = "IMAGEM";

    gerarImagem(prompt: string): string {
        return `[Imagem Gerada]: URL da imagem baseada em: ${prompt}`;
    }

    gerar(prompt: string): string {
        return this.gerarImagem(prompt);
    }
}

class GeradorAudio implements GeradorAudioIA {
    public tipo = "AUDIO";

    gerarAudio(prompt: string): string {
        return `[Áudio Gerado]: Arquivo de voz para: ${prompt}`;
    }

    gerar(prompt: string): string {
        return this.gerarAudio(prompt);
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

// 5. Um modelo específico expõe apenas o contrato que consegue cumprir
class ModeloFocadoEmTexto implements GeradorTextoIA {
    public tipo = "TEXTO";
    public nomeModelo = "ChatGPT-4";

    gerarTexto(prompt: string): string {
        return `[${this.nomeModelo}]: Respondendo ao prompt: ${prompt}`;
    }

    gerar(prompt: string): string {
        return this.gerarTexto(prompt);
    }
}
