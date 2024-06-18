# wallet service(lendsqr backend test)

This is a wallet service api that is created for the backend test of lendsqr. This api is a simple wallet service, where a user can be able to fund their account, transfer funds and withdraw funds from their account

  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

The wallet service api is a simple api that enable a user to create wallets for funding, receiving and transfering funds from one user wallet to another. From this backend api wallet service that can be consumed, a user can create mutiple wallets depending on the currency type specific when creating the wallet.

A user can have at most two wallet, which is a dollar and naira wallet, user can fund their wallet by specifying the currency type. example is getting a balance of a user by specifying the currency type

```
request - http://localhost/balance/1/?currency_type=dollar
```

This api endpoint obtain the balance of a user wallet base on the currency type specified.

## schema

![alt text](wallet_service_schema.png)

this schema show the relationship between tables and how the api service works on the database layer.

## Api documentation

wallet service api is a simple to use api, below are the endpoint available in the walllet service api. relative url should be appended to the baseurl when making api calls.

### create a user (POST) request

url - https://abraham-lendsqr-be-test.onrender.com/api/user/register

request body

```
{
    "email": "abrahamosazee2@gmail.com",
    "first_name": "abraham",
    "last_name": "osazee",
    "phonenumber": "08061909748",
    "date_of_birth": "2001-02-23",
    "password": "Omorisiagbon123",
    "confirmPassword": "Omorisiagbon123"
}

```

response

```
{
    "id": 2,
    "email": "abrahamosazee2@gmail.com",
    "first_name": "abraham",
    "last_name": "osazee",
    "phonenumber": "08061909748",
    "date_of_birth": "2001-02-23T00:00:00.000Z",
    "created_at": "2024-06-18T18:00:50.000Z",
    "updated_at": "2024-06-18T18:00:50.000Z"
}
```

### get api key to authenticate endpoints (POST) request

url - https://abraham-lendsqr-be-test.onrender.com/api/user/api_key

request body

```
{
    "email": "abrahamosazee3@gmail.com",
    "password": "Omorisiagbon123"
}
```

response

```
{
    "api_key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoiYWJyYWhhbW9zYXplZTNAZ21haWwuY29tIiwiaWF0IjoxNzE4NzMzODQ3LCJleHAiOjE3MTg4MjAyNDd9.vf53IqRi9zx4bsPQKH9t6J0ZuTyJmGmu8EHIbfQmqZc"
}
```

### get user balance GET request (ensure that user with id has created a wallet of currency_type)

url - https://abraham-lendsqr-be-test.onrender.com/api/user/balance/1?currency_type=dollar

response

```
{
    "id": 1,
    "email": "abrahamosazee3@gmail.com",
    "balance": "60.00",
    "currency_type": "dollar"
}
```

### create wallet (POST) request

url - https://abraham-lendsqr-be-test.onrender.com/api/wallet/create

request body

```
{
    "user_id": 2,
    "currency_type": "dollar"
}
```

response

```
{
    "id": 2,
    "user_id": 2,
    "currency_type": "dollar",
    "balance": "0.00",
    "created_at": "2024-06-18T18:11:09.000Z",
    "updated_at": "2024-06-18T18:11:09.000Z"
}
```

### fund user wallet (PUT) request

url - https://abraham-lendsqr-be-test.onrender.com/api/wallet/fund

request body

```
{
    "user_id": 1,
    "currency_type": "dollar",
    "amount": 60
}
```

response

```
{
    "id": 1,
    "user_id": 1,
    "currency_type": "dollar",
    "balance": "60.00"
}
```

### transfer funds (PUT) request

url - https://abraham-lendsqr-be-test.onrender.com/api/wallet/transfer

request body

```{
    "from_user_id": 1,
    "to_user_id": 2,
    "currency_type": "dollar",
    "amount": 10
}

```

response

```
transfer successful
```

After transfering funds, you can check the user balance to ensure that funds was transfer succesfully

### withdraw funds

url - https://abraham-lendsqr-be-test.onrender.com/api/wallet/withdraw

request body

```
{
    "user_id": 1,
    "currency_type": "dollar",
    "amount": 10
}
```

response

```
{
    "id": 1,
    "user_id": 1,
    "currency_type": "dollar",
    "balance": "50.00",
    "withdraw_fund": 10
}
```

## Stay in touch

- Author - Omorisiagbon Abraham
- linkedin - [https://www.linkedin.com/in/abraham-omorisiagbon-619796233/](https://www.linkedin.com/in/abraham-omorisiagbon-619796233/)
- Twitter - [abrahamoz\_](https://x.com/abrahamoz_)

## License

lendsqr wallet service backend test is [MIT licensed](LICENSE).
