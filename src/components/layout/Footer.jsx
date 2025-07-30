import React from 'react';
import { Link } from 'react-router-dom';
import { Code, Github, Twitter, Mail } from 'lucide-react';
import { ROUTES } from '../../utils/constant';

const Footer = () => {
  return (
    <footer className="border-t bg-background">
        <div className="py-4 flex flex-col justify-center items-center text-black text-center text-sm text-muted-foreground">
          <p>© 2025 CodeJudge. All rights reserved.</p>
        </div>
    </footer>
  );
};

export default Footer;