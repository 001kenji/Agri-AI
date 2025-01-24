
lastseenval = [{'time': "2024-11-28T12:23:19", 'email': "gestuser@gmail.com"},
{'time': "2024-11-28T12:23:19", 'email': "gestuser@gmail.com"},
{'time': "2024-11-28T14:33:10", 'email': "mack@gmail.com"},
{'time': "2024-11-28T14:33:11", 'email': "gestuser@gmail.com"}]


index = 0
IsNotAppend = False
for index in lastseenval:
    if index['email'] == 'kenji@gmail.com':
        IsNotAppend = True
        break


print(IsNotAppend)