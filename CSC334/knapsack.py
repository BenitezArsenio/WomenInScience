##Given a set of items with specific weights and values, the aim is to
## get as much value into the knapsack as possible given the weight constraint of the knapsack.
import random 
def getObjects(limit):
    numOfObjects = random.randint(15)
    arrayObj = []
    for i in range(0,numOfObjects):
        arrayObj.push(thing(random.randint(limit),random.randint(15)))
    return arrayObj

class thing:
  def __init__(self, weight, value):
    self.weight= weight
    self.value = value


def main():
##need to get a weight limit on the knapsack
##need to get objects with random weight and random value
    limit = 30
    things = getObjects(limit)
    print(things)
##find best possible combination
main()
