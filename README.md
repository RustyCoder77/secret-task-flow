# Secret Task Flow

A decentralized task management platform built with FHE (Fully Homomorphic Encryption) technology for secure and private task handling.

## Features

- **Secure Task Management**: Create, assign, and track tasks with end-to-end encryption
- **FHE Integration**: Core data is encrypted using Fully Homomorphic Encryption
- **Web3 Wallet Integration**: Connect with popular wallets like Rainbow, MetaMask, and more
- **Decentralized Storage**: Tasks and data stored on blockchain for transparency and immutability
- **Privacy-First**: All sensitive information remains encrypted even during processing

## Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Components**: shadcn/ui, Radix UI, Tailwind CSS
- **Web3**: RainbowKit, Wagmi, Viem
- **Blockchain**: Ethereum Sepolia Testnet
- **Encryption**: FHE (Fully Homomorphic Encryption)
- **State Management**: TanStack Query

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Web3 wallet (MetaMask, Rainbow, etc.)
- Sepolia ETH for gas fees

### Installation

1. Clone the repository:
```bash
git clone https://github.com/RustyCoder77/secret-task-flow.git
cd secret-task-flow
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Update the `.env` file with your configuration:
```
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/b18fb7e6ca7045ac83c41157ab93f990
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=2ec9743d0d0cd7fb94dee1a7e6d33475
NEXT_PUBLIC_INFURA_API_KEY=b18fb7e6ca7045ac83c41157ab93f990
NEXT_PUBLIC_RPC_URL=https://1rpc.io/sepolia
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:5173](http://localhost:5173) in your browser

## Usage

1. **Connect Wallet**: Click the "Connect Wallet" button to connect your Web3 wallet
2. **Create Tasks**: Add new tasks with encrypted descriptions and sensitive data
3. **Assign Tasks**: Assign tasks to team members while maintaining privacy
4. **Track Progress**: Monitor task completion with encrypted status updates
5. **View Analytics**: Access encrypted analytics and reporting

## Smart Contract

The platform uses a smart contract deployed on Ethereum Sepolia testnet that implements:

- FHE-encrypted task storage
- Secure task assignment and updates
- Privacy-preserving analytics
- Decentralized access control

## Security Features

- **FHE Encryption**: All sensitive data is encrypted using Fully Homomorphic Encryption
- **Zero-Knowledge Proofs**: Verify task completion without revealing details
- **Decentralized Access**: No single point of failure or data breach
- **Audit Trail**: Immutable blockchain records for compliance

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions, please open an issue on GitHub or contact the development team.

## Roadmap

- [ ] Multi-chain support
- [ ] Advanced FHE operations
- [ ] Mobile app
- [ ] Enterprise features
- [ ] API integration