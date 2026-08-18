import requests
from bs4 import BeautifulSoup
import pandas as pd

URL = "https://sigeho.ifce.edu.br/visualizar-horarios-curso/"


class SIGEHO:

    def __init__(self):
        self.session = requests.Session()
        self.csrf = None
        self.soup = None

    def conectar(self):
        """Abre a página inicial."""

        r = self.session.get(URL)
        r.raise_for_status()

        self.soup = BeautifulSoup(r.text, "html.parser")

        self.csrf = self.soup.find(
            "input",
            {"name": "csrfmiddlewaretoken"}
        )["value"]

    def listar_cursos(self):
        select = self.soup.find("select", {"name": "todosCurso"})

        cursos = []

        for option in select.find_all("option"):

            value = option.get("value")

            if not value:
                continue

            cursos.append({
                "id": value,
                "nome": option.get_text(" ", strip=True)
            })

        return cursos

    def listar_semestres(self):

        select = self.soup.find("select", {"name": "todosSemestre"})

        semestres = []

        for option in select.find_all("option"):

            value = option.get("value")

            if not value:
                continue

            semestres.append({
                "id": value,
                "nome": option.get_text(" ", strip=True)
            })

        return semestres

    def consultar(self, semestre_id, curso_id):

        dados = {
            "campus_id": 3,
            "csrfmiddlewaretoken": self.csrf,
            "todosSemestre": semestre_id,
            "todosCurso": curso_id,
        }

        headers = {
            "Referer": URL,
            "Origin": "https://sigeho.ifce.edu.br",
        }

        r = self.session.post(
            URL,
            data=dados,
            headers=headers,
        )

        r.raise_for_status()

        return r.text


def imprimir_lista(lista, titulo):

    print("\n" + "=" * 60)
    print(titulo)
    print("=" * 60)

    for i, item in enumerate(lista, start=1):
        print(f"{i:2} - {item['nome']}")

    print()


def escolher(lista):

    while True:

        try:

            opcao = int(input("Escolha uma opção: "))

            if 1 <= opcao <= len(lista):
                return lista[opcao - 1]

            print("Opção inválida.")

        except ValueError:
            print("Digite apenas números.")


def mostrar_tabelas(html):

    print("\nExtraindo tabelas...\n")

    tabelas = pd.read_html(html)

    print(f"Foram encontradas {len(tabelas)} tabela(s).\n")

    for i, tabela in enumerate(tabelas, start=1):

        print("=" * 80)
        print(f"TABELA {i}")
        print("=" * 80)

        print(tabela)

        print()


def main():

    sigeho = SIGEHO()

    print("Conectando ao SIGEHO...")

    sigeho.conectar()

    semestres = sigeho.listar_semestres()

    cursos = sigeho.listar_cursos()

    imprimir_lista(semestres, "SEMESTRES")

    semestre = escolher(semestres)

    imprimir_lista(cursos, "CURSOS")

    curso = escolher(cursos)

    print("\nConsultando horários...\n")

    html = sigeho.consultar(
        semestre["id"],
        curso["id"]
    )

    mostrar_tabelas(html)


if __name__ == "__main__":
    main()