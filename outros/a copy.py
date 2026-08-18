import requests

sessao = requests.Session()

url = "https://sigeho.ifce.edu.br/visualizar-horarios-curso/"

r = sessao.get(url)

# print(r.content)

from bs4 import BeautifulSoup

soup = BeautifulSoup(r.text, "html.parser")

csrf = soup.find(
    "input",
    {"name": "csrfmiddlewaretoken"}
)["value"]

print(csrf)

dados = {
    "campus_id": 3,
    "csrfmiddlewaretoken": csrf,
    "todosSemestre": 94,
    "todosCurso": 9,
}

headers = {
    "Referer": url,
}

r = sessao.post(
    url,
    data=dados,
    headers=headers,
)

print(r.status_code)

soup = BeautifulSoup(r.text, "html.parser")

import tableprint as tp

tabelas = soup.find_all("table")

print(len(tabelas))

print(r.url)
print(r.status_code)
print(r.text[:1000])

tr = soup.find_all("tr")
print(len(tr))


# for tr in soup.find_all("tr"):
#     print(tr.get_text(" ", strip=True))
dadost = []

for tabela in tabelas:
    for tr in tabela.find_all("tr"):
        linha = [
            td.get_text(" ", strip=True)
            for td in tr.find_all(["th", "td"])
        ]

        if linha:
            dadost.append(linha)

tp.table(dadost)