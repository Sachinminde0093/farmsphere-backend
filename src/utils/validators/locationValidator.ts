
const coordinatesValidator = (value:String, helpers:any) => {
	const coordinates = value.split(',');
	if (coordinates.length !== 2) {
		return helpers.error('any.invalid');
	}

	const [latitude, longitude] = coordinates.map(parseFloat);

	if (isNaN(latitude) || isNaN(longitude)) {
		return helpers.error('any.invalid');
	}

	if (latitude < -90 || latitude > 90) {
		return helpers.error('any.invalid');
	}

	if (longitude < -180 || longitude > 180) {
		return helpers.error('any.invalid');
	}

	return [latitude, longitude];
};


export default coordinatesValidator;