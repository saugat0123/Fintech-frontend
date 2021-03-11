export enum RelationshipNepali {
    GRANDFATHER ='हजुरबुवा',
    GRANDMOTHER = 'हजुरआमा',
    FATHER = 'बुबा',
    MOTHER = 'आमा',
    UNCLE = 'काका',
    AUNT = 'काकी',
    SMALLSISTER = 'बहिनी',
    BIGSISTER = 'दिदी',
    SMALLBROTHER = 'भाई',
    BIGBROTHER = 'दाई',
    SON = 'छोरा',
    DAUGHTER = 'छोरी',
    SPOUSE = 'जीवनसाथी',
    DAUGHTERINLAW = 'बुहारी',
    SONINLAW = 'ज्वाई',
    FATHERINLAW = 'ससुरा',
    MOTHERINLAW = 'सासु',
    FRIEND = 'साथी',
    NEIGHBOR = 'छिमेकी',
    PARTNER = 'साथी',
    DIRECTOR = 'निर्देशक',
    SHAREHOLDER = 'शेयर होल्डर',
    OTHER = 'अन्य'
}

export namespace RelationshipNepali {
    export function values() {
        return Object.keys(RelationshipNepali).filter(
            (type) => isNaN(<any>type) && type !== 'values' && type !== 'enumObject'
        );
    }

    export function enumObject() {
        const enums = [];
        values().forEach(elem => {
            enums.push({
                key: elem,
                value: RelationshipNepali[elem],
            });
        });
        return enums;
    }

}
