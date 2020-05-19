import{Request, Response} from 'express';

export function corsFilter(req: Request, resp: Response, next){
	// resp.header('Access-Control-Allow-Origin', 'http://localhost:3000');
	resp.header('Access-Control-Allow-Origin', 'http://jeremy-java-react-revature.s3-website.us-east-2.amazonaws.com');
	resp.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept');
	resp.header('Access-Control-Allow-Credentials','true');
	resp.header('Access-Control-Allow-Methods','GET,POST,PUT,PATCH,DELETE');

	if(req.method === 'OPTIONS'){
		resp.sendStatus(200);
	}else{
		next();
	}
}