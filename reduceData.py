import json


def prune_dict(reference_dict, input_dict, limit_elements=None):
    pruned_dict = {}

    for key, inner_dict_to_prune in input_dict.items():
        if limit_elements is not None:
            limit_elements -= 1
            if limit_elements < 0:
                break

        pruned_inner_dict = {}

        for ref_key, ref_value in reference_dict.items():
            if ref_key in inner_dict_to_prune:
                if isinstance(inner_dict_to_prune[ref_key], dict):
                    pruned_inner_dict[ref_key] = inner_prune(
                        ref_value, inner_dict_to_prune[ref_key])
                elif isinstance(inner_dict_to_prune[ref_key], list):
                    pruned_inner_dict[ref_key] = []
                    if len(ref_value) > 0:
                        pruned_inner_dict[ref_key] = []
                        for item in inner_dict_to_prune[ref_key]:
                            if isinstance(item, dict):
                                pruned_inner_dict[ref_key].append(
                                    inner_prune(ref_value[0], item))
                            else:
                                pruned_inner_dict[ref_key].append(item)
                else:
                    pruned_inner_dict[ref_key] = inner_dict_to_prune[ref_key]

        if pruned_inner_dict:
            pruned_dict[key] = pruned_inner_dict

    return pruned_dict


def inner_prune(reference_dict, inner_dict_to_prune):
    pruned_inner_dict = {}

    for ref_key, ref_value in reference_dict.items():
        if ref_key in inner_dict_to_prune:
            if isinstance(ref_value, dict) and isinstance(inner_dict_to_prune[ref_key], dict):
                pruned_inner_dict[ref_key] = inner_prune(
                    ref_value, inner_dict_to_prune[ref_key])
            elif isinstance(ref_value, list) and isinstance(inner_dict_to_prune[ref_key], list):
                if len(ref_value) > 0:
                    pruned_inner_dict[ref_key] = []
                    for i, item in enumerate(inner_dict_to_prune[ref_key]):
                        if isinstance(item, dict):
                            pruned_inner_dict[ref_key].append(
                                inner_prune(ref_value[0], item))
                        else:
                            pruned_inner_dict[ref_key].append(item)
            else:
                pruned_inner_dict[ref_key] = inner_dict_to_prune[ref_key]

    return pruned_inner_dict


# Unit test
def test():
    reference = {"a": "value", "f": {"aa": "bbb"}}
    dict_to_prune = {
        "a": {"ab": "valueab", "a": "valuea"},
        "b": {"ab": "valueabb", "a": "valueab", "c": "wewe", "f": {"m": "bbb"}}
    }

    pruned_dict = prune_dict(reference, dict_to_prune)


''' HANDLES CHAMPIONS'''

with open('./data/original/champions.json', 'r', encoding='utf-8') as f:
    dict_to_prune = json.load(f)

with open('./data/ref/ref_champion.json', 'r', encoding='utf-8') as f:
    reference = json.load(f)

# Esegui la potatura
champions_pruned = prune_dict(reference, dict_to_prune, limit_elements=None)


with open("./data/processed/champions.json", "w") as f:
    json.dump(champions_pruned, f, indent=2)

''' HANDLES ITEMS'''

with open('./data/original/items.json', 'r', encoding='utf-8') as f:
    dict_to_prune = json.load(f)

with open('./data/ref/ref_item2.json', 'r', encoding='utf-8') as f:
    reference = json.load(f)

# Esegui la potatura
items_pruned = prune_dict(reference, dict_to_prune, limit_elements=None)


with open("./data/processed/items.json", "w") as f:
    json.dump(items_pruned, f, indent=2)



