from enum import Enum

class GroceryStoreEnum(Enum):
    NO_FRILLS = 'No Frills'
    WALMART = 'Walmart'
    FOODY_WORLD = 'Foody World'
    FARM_FRESH = 'Farm Fresh'
    H_MART = 'H Mart'
    ASIA_FOOD_MART = 'Asia Food Mart'
    FRESHWAY = 'Freshway'
    DOLLARAMA = 'Dollarama'
    REAL_CANADIAN = 'Real Canadian'
    SHOPPERS_DRUG_MART = 'Shoppers Drug Mart'
    METRO = 'Metro'
    BULK_BARN = 'Bulk Barn'
    REXALL = 'Rexall'
    BESTCO = 'Bestco'
    COSTCO = 'Costco'
    TNT = 'T&T'
    CANADIAN_TIRE = 'Canadian Tire'
    IKEA = 'IKEA'

    _variations = {
        'NO_FRILLS': ["NICK'S NO FRILLS", "NO FRILLS"],
        'WALMART': ["WALMART"],
        'FOODY_WORLD': ["FOODY WORLD"],
        'FARM_FRESH': ["FARM FRESH"],
        'H_MART': ["H MART", "H-MART"],
        'ASIA_FOOD_MART': ["ASIA FOOD MART"],
        'FRESHWAY': ["FRESHWAY"],
        'DOLLARAMA': ["DOLLARAMA"],
        'REAL_CANADIAN': ["REAL CANADIAN"],
        'SHOPPERS_DRUG_MART': ["SHOPPERS DRUG MART", "SHOPPERS"],
        'METRO': ["METRO"],
        'BULK_BARN': ["BULK BARN"],
        'REXALL': ["REXALL"],
        'BESTCO': ["BESTCO"],
        'COSTCO': ["COSTCO"],
        'TNT': ["T&T", "TNT"],
        'CANADIAN_TIRE': ["CANADIAN TIRE", "CANTIRE"],
        'IKEA': ["IKEA"]
    }

    @classmethod
    def _generate_mapping(cls):
        mapping = {}
        for enum_member in cls:
            store_variations = cls._variations.value.get(enum_member.name, [])
            for variation in store_variations:
                mapping[variation.upper()] = enum_member
        return mapping
        
    @classmethod
    def check_mapping(cls, store_name: str):
        return store_name.strip().upper() in cls.store_mapping

    @classmethod
    def map_to_enum(cls, store_name: str):
        try:
            return cls.store_mapping[store_name.strip().upper()]
        except KeyError:
            raise ValueError(f"Unknown grocery store name: {store_name}")
        
GroceryStoreEnum.store_mapping = GroceryStoreEnum._generate_mapping()
