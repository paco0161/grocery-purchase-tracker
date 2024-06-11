class SheetRequest():
    def __init__(self, majorDimension: str="ROWS", range: str="'Monthly Grocery Purchase'", values: list=None):
        self.majorDimension = majorDimension
        self.range = range
        self.values = values