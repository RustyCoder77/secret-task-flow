# Vercel Deployment Guide for Secret Task Flow

This guide provides step-by-step instructions for deploying the Secret Task Flow application to Vercel.

## Prerequisites

- GitHub account with access to the repository
- Vercel account (free tier available)
- Node.js 18+ installed locally (for testing)

## Step 1: Prepare Environment Variables

Before deploying, you need to set up the following environment variables in Vercel:

### Required Environment Variables

```bash
# Blockchain Configuration
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/b18fb7e6ca7045ac83c41157ab93f990

# Wallet Connect Configuration
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=2ec9743d0d0cd7fb94dee1a7e6d33475

# Infura Configuration (Optional)
NEXT_PUBLIC_INFURA_API_KEY=b18fb7e6ca7045ac83c41157ab93f990
NEXT_PUBLIC_RPC_URL=https://1rpc.io/sepolia

# Smart Contract Address (Update after deployment)
NEXT_PUBLIC_CONTRACT_ADDRESS=

# FHE Configuration
NEXT_PUBLIC_FHE_NETWORK_URL=
```

## Step 2: Deploy to Vercel

### Method 1: Using Vercel Dashboard (Recommended)

1. **Visit Vercel Dashboard**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with your GitHub account

2. **Import Project**
   - Click "New Project" button
   - Select "Import Git Repository"
   - Choose `RustyCoder77/secret-task-flow` from the list
   - Click "Import"

3. **Configure Project Settings**
   - **Project Name**: `secret-task-flow` (or your preferred name)
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Set Environment Variables**
   - In the "Environment Variables" section
   - Add each environment variable from Step 1
   - Make sure to set them for all environments (Production, Preview, Development)

5. **Deploy**
   - Click "Deploy" button
   - Wait for the build to complete (usually 2-5 minutes)

### Method 2: Using Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy from Project Directory**
   ```bash
   cd /path/to/secret-task-flow
   vercel
   ```

4. **Follow the Prompts**
   - Link to existing project or create new one
   - Set up environment variables when prompted
   - Confirm deployment settings

## Step 3: Configure Custom Domain (Optional)

1. **Add Domain in Vercel Dashboard**
   - Go to your project settings
   - Navigate to "Domains" tab
   - Add your custom domain
   - Follow DNS configuration instructions

2. **Update Environment Variables**
   - If using custom domain, update any hardcoded URLs in the application

## Step 4: Post-Deployment Configuration

### 1. Update Contract Address
After deploying your smart contract to Sepolia testnet:

1. Go to Vercel Dashboard
2. Navigate to your project settings
3. Go to "Environment Variables"
4. Update `NEXT_PUBLIC_CONTRACT_ADDRESS` with your deployed contract address
5. Redeploy the application

### 2. Test the Application
1. Visit your deployed URL
2. Connect a wallet (MetaMask, Rainbow, etc.)
3. Ensure you're on Sepolia testnet
4. Test the registration and task creation features

## Step 5: Monitoring and Maintenance

### 1. Monitor Deployments
- Check Vercel dashboard for deployment status
- Monitor function logs for any errors
- Set up alerts for failed deployments

### 2. Update Application
- Push changes to the main branch
- Vercel will automatically redeploy
- Test the updated application

### 3. Environment Management
- Use Vercel's environment variable management
- Keep sensitive data secure
- Use different variables for different environments

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version compatibility
   - Ensure all dependencies are properly installed
   - Review build logs in Vercel dashboard

2. **Environment Variable Issues**
   - Verify all required variables are set
   - Check variable names for typos
   - Ensure variables are available in all environments

3. **Wallet Connection Issues**
   - Verify WalletConnect Project ID is correct
   - Check RPC URL configuration
   - Ensure contract address is set correctly

4. **Contract Interaction Issues**
   - Verify contract is deployed on Sepolia
   - Check contract ABI matches deployed contract
   - Ensure user has Sepolia ETH for gas fees

### Getting Help

- Check Vercel documentation: [vercel.com/docs](https://vercel.com/docs)
- Review application logs in Vercel dashboard
- Test locally before deploying changes

## Security Considerations

1. **Environment Variables**
   - Never commit sensitive data to repository
   - Use Vercel's secure environment variable storage
   - Regularly rotate API keys and tokens

2. **Smart Contract Security**
   - Audit contracts before mainnet deployment
   - Use testnet for development and testing
   - Implement proper access controls

3. **Frontend Security**
   - Validate all user inputs
   - Use HTTPS for all communications
   - Implement proper error handling

## Performance Optimization

1. **Build Optimization**
   - Use Vite's build optimizations
   - Implement code splitting
   - Optimize images and assets

2. **Runtime Performance**
   - Use React.memo for expensive components
   - Implement proper loading states
   - Optimize re-renders

3. **Network Optimization**
   - Use CDN for static assets
   - Implement caching strategies
   - Optimize API calls

## Cost Management

1. **Vercel Free Tier Limits**
   - 100GB bandwidth per month
   - 100 serverless function executions per day
   - 1 concurrent build

2. **Optimization Tips**
   - Use static generation where possible
   - Implement efficient caching
   - Monitor usage in Vercel dashboard

## Next Steps

After successful deployment:

1. **Set up monitoring and analytics**
2. **Implement CI/CD pipeline**
3. **Add automated testing**
4. **Set up staging environment**
5. **Plan for scaling**

## Support

For issues related to:
- **Vercel**: Check [Vercel Support](https://vercel.com/support)
- **Application**: Review GitHub issues and documentation
- **Smart Contracts**: Check contract deployment logs and testnet explorer
