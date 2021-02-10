## ExpertsClub Example Auth API

Install dependencies:
```sh
$ yarn install
```

Pull and run `mongo:latest` docker image:
```sh
$ sudo docker pull mongo:latest
$ sudo docker run --name mongo -d -p 27017:27017 mongo:latest
```
---------

### Usage

- Dev:
    ```sh
    $ yarn run dev
    ```

- To deploy at desired environment (if environment does not exist, it will automatically create a new one):
    ```sh
    $ yarn deploy --stage ENV_TO_DEPLOY
    ```
    AWS Credentials are required to be set up (`AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` environment variables) to deploy