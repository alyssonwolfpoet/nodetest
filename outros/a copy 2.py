import requests
from bs4 import BeautifulSoup
import tableprint as tp


URL = "https://sigeho.ifce.edu.br/visualizar-horarios-curso/"


class SIGEHO:
    def __init__(self):
        self.session = requests.Session()

    def obter_csrf(self):
        """Abre a página e retorna o token CSRF."""
        resposta = self.session.get(URL)
        resposta.raise_for_status()

        soup = BeautifulSoup(resposta.text, "html.parser")

        csrf = soup.find(
            "input",
            {"name": "csrfmiddlewaretoken"}
        )["value"]

        return csrf

    def consultar_horarios(self, campus, semestre, curso):
        """Realiza a consulta dos horários."""

        csrf = self.obter_csrf()

        dados = {
            "campus_id": campus,
            "csrfmiddlewaretoken": csrf,
            "todosSemestre": semestre,
            "todosCurso": curso,
        }

        headers = {
            "Referer": URL,
            "Origin": "https://sigeho.ifce.edu.br",
        }

        resposta = self.session.post(
            URL,
            data=dados,
            headers=headers,
        )

        resposta.raise_for_status()

        return resposta

    @staticmethod
    def extrair_tabelas(html):
        """Extrai todas as tabelas HTML."""

        soup = BeautifulSoup(html, "html.parser")

        tabelas = []

        for tabela in soup.find_all("table"):
            linhas = []

            for tr in tabela.find_all("tr"):
                colunas = [
                    td.get_text(" ", strip=True)
                    for td in tr.find_all(["th", "td"])
                ]

                if colunas:
                    linhas.append(colunas)

            if linhas:
                tabelas.append(linhas)

        return tabelas


def main():
    sigeho = SIGEHO()

    resposta = sigeho.consultar_horarios(
        campus=3,
        semestre=94,
        curso=9,
    )

    print("=" * 60)
    print("Status:", resposta.status_code)
    print("URL:", resposta.url)
    print("=" * 60)

    tabelas = sigeho.extrair_tabelas(resposta.text)

    print(f"Tabelas encontradas: {len(tabelas)}")

    if not tabelas:
        print("\nNenhuma tabela encontrada.")
        print("\nPrimeiros 1000 caracteres da resposta:\n")
        print(resposta.text[:1000])
        return

    for i, tabela in enumerate(tabelas, start=1):
        print(f"\nTabela {i}\n")
        tp.table(tabela)


if __name__ == "__main__":
    main()