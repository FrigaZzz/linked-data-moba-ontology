import json



with open('./data/ref/ref_item2.json', 'r', encoding='utf-8') as f:
    reference_item = json.load(f)


with open('./data/ref/ref_champion.json', 'r', encoding='utf-8') as f:
    reference_champ = json.load(f)


with open('./data/processed/items.json', 'r', encoding='utf-8') as f:
    proc_items = json.load(f)


with open('./data/processed/champions.json', 'r', encoding='utf-8') as f:
    proc_champs = json.load(f)


# extract all possible values for each key inside proc_items. Notice that
# each key could have multiple values like a list, a dict or a string (and so on)
# def extract_values(data):
#     values = {}

#     def extract_helper(item, current_key=""):
#         if isinstance(item, dict):
#             for key, value in item.items():
#                 if current_key:
#                     new_key = current_key + "." + key
#                 else:
#                     new_key = key
#                 extract_helper(value, new_key)
#         elif isinstance(item, list):
#             for i, value in enumerate(item):
#                 if current_key:
#                     new_key = current_key + "." + str(i)
#                 else:
#                     new_key = str(i)
#                 extract_helper(value, new_key)
#         else:
#             values.setdefault(current_key, []).append(item)

#     for d in data.values():
#         extract_helper(d)

#     return values

# def extract_values(args):
#     values = {}

#     def extract_helper(item, current_key=()):
#         if isinstance(item, dict):
#             for key, value in item.items():
#                 extract_helper(value, current_key + (key,))
#         elif isinstance(item, list):
#             for i, value in enumerate(item):
#                 extract_helper(value, current_key + (i,))
#         else:
#             values.setdefault(current_key, []).append(item)

#     for data in args.values():
#         extract_helper(data)

#     # Update values dictionary to include inner key values
#     inner_key_values = {}
#     for key, value in values.items():
#         if isinstance(key, tuple) and len(key) > 1:
#             parent_key = key[:-1]
#             inner_key = key[-1]
#             inner_key_values.setdefault(parent_key, {}).setdefault(inner_key, []).extend(value)

#     values.update(inner_key_values)

#     return values

def extract_values(data):
    values = {}
    
    def extract_helper(item, current_key):
        if isinstance(item, dict):
            for key, value in item.items():
                extract_helper(value, current_key + "." + str(key) if current_key else str(key))
        elif isinstance(item, list):
            merged_dict = {}
            for i, value in enumerate(item):
                if isinstance(value, dict):
                    merged_dict.update(value)
                else:
                    values.setdefault(current_key , []).append(value)
            if merged_dict:
                extract_helper(merged_dict, current_key)
        else:
            values.setdefault(current_key, []).append(item)
    for d in data.values():
        extract_helper(d, "")
    
    return values


def tuple_to_json(data):
    copy = data.copy()
    for key,value in data.items():
        del copy[key]
        key = str(key)
        copy[key] =value
    return copy

def generate_intermediate_keys(data):
    intermediate_keys = {}
    
    for key in data.keys():
        parts = key.split(".")
        for i in range(len(parts)):
            intermediate_key = ".".join(parts[:i+1])
            intermediate_keys.setdefault(intermediate_key, [])
            if i < len(parts) - 1 and parts[i+1] not in intermediate_keys[intermediate_key]:
                intermediate_keys[intermediate_key].append(parts[i+1])
    
    for intermediate_key, subsequent_keys in intermediate_keys.items():
        if intermediate_key not in data:
            data[intermediate_key] = subsequent_keys
    
    return data


items_values =generate_intermediate_keys(extract_values(proc_items))
#each key should have a list of unique values
for key, value in items_values.items():
    items_values[key] = list(set(value))

# print in a txt file
with open('./data/values/items.txt', 'w', encoding='utf-8') as f:
    for key, value in items_values.items():
        f.write(f'{key}: {value}\n\n')



champ_values = generate_intermediate_keys(extract_values(proc_champs))
#each key should have a list of unique values
for key, value in champ_values.items():
    champ_values[key] = list(set(value))

# print in a txt file
with open('./data/values/champions.txt', 'w', encoding='utf-8') as f:
    for key, value in champ_values.items():
        f.write(f'{key}: {value}\n\n')

with open('./data/values/champions.json', 'w', encoding='utf-8') as f:
    json.dump(tuple_to_json(champ_values), f, ensure_ascii=False, indent=4)

with open('./data/values/items.json', 'w', encoding='utf-8') as f:
    json.dump(tuple_to_json(items_values), f, ensure_ascii=False, indent=4)

# # extract all possible values for each key inside proc_champs
# def extract_values_champs(champs):
#     values = {}
#     for champ in champs:
#         for key, value in champ.items():
#             if key not in values:
#                 values[key] = []
#             if value not in values[key]:
#                 values[key].append(value)
#     return values

# # execute the extraction
# values = extract_values(proc_items)
# values_champs = extract_values_champs(proc_champs)
# # dumps the values into a json file
# with open('./data/values/items.json', 'w', encoding='utf-8') as f:
#     json.dump(values, f, ensure_ascii=False, indent=4)

# with open('./data/values/champs.json', 'w', encoding='utf-8') as f:
#     json.dump(values_champs, f, ensure_ascii=False, indent=4)
