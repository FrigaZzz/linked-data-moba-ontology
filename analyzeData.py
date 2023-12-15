import json
import pandas as pd

with open('./data/values/champions.json', 'r', encoding='utf-8') as f:
    champ_values = json.load(f)

with open('./data/values/items.json', 'r', encoding='utf-8') as f:
    items_values = json.load(f)



# create multiple pandas dataframes from json for each key
#to show off the different values associated with each key

champ_values = pd.DataFrame.from_dict(champ_values, orient='index')
items_values = pd.DataFrame.from_dict(items_values, orient='index')

items_values.to_excel('./data/values/items.xlsx')
champ_values.to_excel('./data/values/champions.xlsx')

