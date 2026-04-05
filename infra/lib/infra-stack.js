import cdk from 'aws-cdk-lib';
const { Duration, Stack } = cdk;
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import path from 'path';
import { fileURLToPath } from 'url';

// Convert import.meta.url to __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class InfraStack extends Stack {
  /**
   *
   * @param {Construct} scope
   * @param {string} id
   * @param {StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);
    
    const backendLambda = new lambda.Function(this, 'BackendLambda', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',   // file.exportedFunction
      code: lambda.Code.fromAsset(path.join(__dirname, '../../backend')), // path to your backend
      memorySize: 512,
      timeout: Duration.seconds(10), 
      environment: {
        JWT_SECRET: 'standerlois0303',
        DB_PASSWORD: 'standerlois',
      },
    });

    // API Gateway to expose the Lambda
    new apigateway.LambdaRestApi(this, 'BackendApi', {
      handler: backendLambda,
      proxy: true,
    });
  }
}

export default InfraStack;
