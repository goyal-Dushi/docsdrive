import { fetchAuthSession } from "aws-amplify/auth";

const getIdToken = async () => {
	const idToken = (await fetchAuthSession()).tokens?.idToken?.toString();
	return idToken;
};

export default getIdToken;
