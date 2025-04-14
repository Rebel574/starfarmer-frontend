export interface OrdersListResponse {
    status: string;
    results: number;
    data: {
      orders: Array<{
        _id: string;
        createdAt: string;
        updatedAt: string;
        items: Array<{
          productId: {
            _id: string;
            name: {
              en: string;
              mr: string;
              _id: string;
            };
            image: string;
          };
          quantity: number;
          price: number;
          _id: string;
        }>;
        paymentGateway: string;
        paymentMethod: string;
        paymentStatus: string;
        shippingAddress: {
          fullName: string;
          phone: string;
          addressLine1: string;
          addressLine2: string;
          city: string;
          state: string;
          pincode: string;
        };
        shippingCharge: number;
        status: string;
        total: number;
        userId: {
          _id: string;
          email: string;
          name: string;
        };
      }>;
    };
  }
  


  export interface Order {
    _id: string;
    createdAt: string;
    items: Array<{
      productId: {
        _id: string;
        name: {
          en: string;
          mr: string;
          _id: string;
        };
        image: string;
      };
      quantity: number;
      price: number;
      _id: string;
    }>;
    paymentGateway: string;
    paymentMethod: string;
    paymentStatus: string;
    shippingAddress: {
      fullName: string;
      phone: string;
      addressLine1: string;
      addressLine2: string;
      city: string;
      state: string;
      pincode: string;
    };
    shippingCharge: number;
    status: string;
    total: number;
    userId: {
      _id: string;
      email: string;
      name: string;
    };
  }