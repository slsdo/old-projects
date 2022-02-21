import os
import json

def output_dir_exists(output_path):
    """
    Create directory if folder doesn't exist, takes in a path, do nothing if it already
    exists, otherwise create it.

    Args:
        output_path: Output location to be inspected
    Returns:
        Output location
    """
    dir = os.path.dirname(output_path)
    if not os.path.exists(dir):
        os.makedirs(dir)
    return output_path

def unique(seq):
    """
    Remove duplicates from a list whilst preserving order, http://stackoverflow.com/a/480227.

    Args:
        seq: A list that may contain duplicate items
    Returns:
        A list containing unique items with items in original order
    """
    seen = set()
    seen_add = seen.add
    return [x for x in seq if not (x in seen or seen_add(x))]

def nsp(n):
    """
    Returns a newline and padding composed of n spaces.
    Args:
        n: Number of spaces to use for padding
    Returns:
        A string consisting of a newline and n number of spaces
    """
    nlsp = '\n'
    for i in range(n):
        nlsp += ' '
    return nlsp