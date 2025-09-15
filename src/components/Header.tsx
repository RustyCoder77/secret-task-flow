import { Button } from "@/components/ui/button";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Users, Shield } from "lucide-react";
import { useAccount } from 'wagmi';

const Header = () => {
  const { address, isConnected } = useAccount();

  return (
    <header className="w-full border-b border-border bg-gradient-subtle">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  Anonymous Tasks, Transparent Results
                </h1>
                <p className="text-sm text-muted-foreground">
                  DAO tasks assigned privately, preventing identity-based bias
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>12 Contributors</span>
            </div>
            
            <ConnectButton 
              chainStatus="icon"
              accountStatus={{
                smallScreen: 'avatar',
                largeScreen: 'full',
              }}
              showBalance={{
                smallScreen: false,
                largeScreen: true,
              }}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;