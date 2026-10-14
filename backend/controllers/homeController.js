export const getHomeData = async (req, res) => {
  try {
    const homeData = {
      title: 'PawGo',
      message: 'Welcome to PawGo. Helping pets find loving homes and caring families.',
      status: 'success'
    };

    return res.status(200).json({
      success: true,
      message: 'Home page data loaded successfully',
      data: homeData
    });
  } catch (error) {
    console.error('Error loading home data:', error);

    return res.status(500).json({
      success: false,
      message: 'Something went wrong while loading the home page data.'
    });
  }
};
