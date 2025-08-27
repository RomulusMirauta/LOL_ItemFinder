import React from 'react';
import '../styles/MainTitle.css';

interface MainTitleProps {
  version?: string;
}

const MainTitle: React.FC<MainTitleProps> = ({ version }) => (
  <div className="main-title-group">
    <h1 className="main-title">League of Legends<br />Item Finder</h1>
    <p className="subtitle">
      EUNE - LIVE &nbsp;|&nbsp; Current Data Dragon Patch Version: {version || 'Loading...'}
    </p>
  </div>
);

export default MainTitle;
