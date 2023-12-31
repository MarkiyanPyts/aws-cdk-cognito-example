import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {aws_cognito, RemovalPolicy, CfnOutput} from 'aws-cdk-lib';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class AwsCdkCognitoExampleStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'AwsCdkCognitoExampleQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });

    const userPool = new aws_cognito.UserPool(this, 'cognito-test-pool', {
      userPoolName: 'cognito-test-pool',
      selfSignUpEnabled: true,
      signInAliases: {
        email: true
      },
      standardAttributes: {
        email: {
          required: true,
          mutable: true
        },
        givenName: {
          required: true,
          mutable: true
        },
        familyName: {
          required: true,
          mutable: true
        }
      },
      passwordPolicy: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireDigits: true,
      },
      accountRecovery: aws_cognito.AccountRecovery.EMAIL_ONLY,
      removalPolicy: RemovalPolicy.DESTROY
    });

    const { OAuthScope }= aws_cognito;

    const userPoolClient = new aws_cognito.UserPoolClient(this, "cognito-test-pool_client", {
      userPool: userPool,
      authFlows: {
        userPassword: true,
        userSrp: true
      },
      generateSecret: false,
      oAuth: {
        flows: {
          authorizationCodeGrant: true
        },
        scopes: [
          OAuthScope.EMAIL,
          OAuthScope.OPENID,
          OAuthScope.PROFILE
        ],
        callbackUrls: [
          "http://localhost:3000"
        ],
        logoutUrls: [
          "http://localhost:3000"
        ]
      },
    })

    new CfnOutput(this, "userPoolId", {
      value: userPool.userPoolId || ""
    })

    new CfnOutput(this, "userPoolClientId", {
      value: userPoolClient.userPoolClientId || ""
    })
  };
  
}
