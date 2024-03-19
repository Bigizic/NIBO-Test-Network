#!/usr/bin/env python3
"""A class FIFOCache that inherits from BaseCaching and is a caching system
"""

from .base_cache import BaseCaching


class FIFOCache(BaseCaching):
    """Implementation of the FIRST IN FIRST OUT(FIFO) caching algorithm
    for the notification system of Nibo test network
    @param (BaseCaching): <BaseCaching class>
    """

    def __init__(self):
        """Constructor
        """
        self.counter = 0
        super().__init__()


    def put(self, key, item):
        """Assigns to the dictionary from BaseCaching the 'item' value of the
        key 'key'
        """
        if key is None or item is None:
            pass

        if key and item not in [None]:
            self.cache_data[key] = item
            self.counter += 1


    def delete(self):
        """Clears notification
        """
        if len(self.cache_data) >= BaseCaching.MAX_ITEMS:
            key_items = [x for x, v in self.cache_data.items()]
            self.cache_data.pop(key_items[0])
            return True
        return False

    def get(self, key):
        """Retrives the value of a key from self.cache_data
        """
        if key:
            for k, v in self.cache_data.items():
                if k == key:
                    temp_val = v
                    self.counter += 1
                    if self.counter > 2:
                        self.delete()
                        self.counter = 0
                    return temp_val
        return None
