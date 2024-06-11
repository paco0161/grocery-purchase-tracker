from enum import Enum, verify, UNIQUE, auto

@verify(UNIQUE)
class Grocery_Store(Enum):
    NO_FRILLS = auto()
    WALMART = auto()
    FOODY_WORLD = auto()
    FARM_FRESH = auto()
    H_MART = auto()
    ASIA_FOOD_MART = auto()
    FRESHWAY = auto()
    DOLLARAMA = auto()
    REAL_CANADIAN = auto()
    SHOPPER_DRUG_MART =  auto()
    METRO = auto()
    BULK_BARN = auto()
    REXALL = auto()
    BESTCO = auto()
    COSTCO = auto()
    TNT = auto()
    CANTIRE = auto()


    

