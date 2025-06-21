export interface UserDetails {
    id: string;
    agentId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    state: string;
    businessName: string;
    dateOfBirth: string;
    identificationType: string;
    identificationNumber: string;
    identificationImages: string[];
    userImage: string;
    isEmailVerified: boolean;
    isKycComplete: boolean;
    store: boolean;
    createdAt: string;
    updatedAt: string;
    parkLocation: string | null;
    walletCustomerId: string | null;
  }
  export interface singleParcelInterface {
    id: string;
    sender: {
      phone: string;
      fullName: string;
      email: string;
      address: string;
    };
    receiver: {
      phone: string;
      fullName: string;
      email: string;
      address: string;
    };
    parcel: {
      type: string;
      value: string;
      chargesPayable: string;
      chargesPaidBy: string;
      handlingFee: string;
      totalFee: string;
      description: string;
      thumbnails: string[];
    };
    park: {
      source: string;
      destination: string;
    };
    
    collectedOnArrivalBy: {
      name: string;
      agentId: string;
  },
    paymentOption: string | null;
    paymentStatus: string;
    driver: string | null;
    status: string;
    parcelId: string;
    qrImage: string;
    createdAt: string;
  }
  
  