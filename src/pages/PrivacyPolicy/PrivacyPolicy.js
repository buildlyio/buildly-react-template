import React from 'react';
import {
  Button,
  Grid,
  Link,
  List,
  ListItem,
  Typography,
} from '@mui/material';
import './PrivacyPolicyStyles.css';
import { routes } from '../../routes/routesConstants';

const PrivacyPolicy = ({ history }) => (
  <Grid container spacing={2} className="privacyPolicyAgreementContainer">
    <Grid item xs={12} textAlign="center">
      <Typography variant="h5">Privacy Policy</Typography>
    </Grid>
    <Grid item xs={12}>
      <Typography variant="body1" paragraph textAlign="justify">
        The Transparent Path website, application and proprietary software platform that tracks supply
        chains (the "Service") is owned and operated by Transparent Path spc ("Transparent Path") and
        made available to registered users who have an account to the Service.  This Privacy Policy
        describes:
      </Typography>
    </Grid>
    <Grid item xs={12}>
      <List
        sx={{
          listStyleType: 'disc',
          listStylePosition: 'inside',
        }}
      >
        <ListItem sx={{ display: 'list-item' }}>Why we collect personal information;</ListItem>
        <ListItem sx={{ display: 'list-item' }}>What personal information we collect and when it is collected;</ListItem>
        <ListItem sx={{ display: 'list-item' }}>How your information is used and protected;</ListItem>
        <ListItem sx={{ display: 'list-item' }}>When and with whom your information is shared; and</ListItem>
        <ListItem sx={{ display: 'list-item' }}>Your choices regarding your personal information.</ListItem>
      </List>
    </Grid>
    <Grid item xs={12}>
      <Typography variant="body1" paragraph textAlign="justify">
        We encourage you to read this Privacy Policy and our
        {' '}
        <Button onClick={() => history.push(routes.ABOUT_PLATFORM)} className="privacyPolicyButton">
          End User Agreement
        </Button>
        {' '}
        carefully. Capitalized terms used but not defined in this Privacy Policy have the meaning
        given them in the End User Agreement.  We will post notices of all changes that materially
        affect the way in which your personally identifiable information may be used or shared in
        updates to our Privacy Policy.
      </Typography>
    </Grid>
    <Grid item xs={12}>
      <Typography variant="body1" paragraph textAlign="justify">
        This policy does not apply to other service providers, advertising systems, networks or websites
        that Transparent Path has a relationship with or of other companies or individuals that
        Transparent Path does not own, employ, manage or control.
      </Typography>
    </Grid>
    <Grid item xs={12}>
      <Typography variant="body1" paragraph textAlign="justify">
        If you have any questions about this Privacy Policy, please feel free to contact us through our
        Service or write to us at Transparent Path SPC, 1700 Westlake Ave N Suite 200, Seattle WA,
        98109.
      </Typography>
    </Grid>
    <Grid item xs={12}>
      <Typography className="privacyPolicyHeading">Information We Collect</Typography>
    </Grid>
    <Grid item xs={12}>
      <Typography variant="body1" paragraph textAlign="justify">
        The information we learn from users helps us not only provide the Service but also to
        personalize and continually improve each user's experience with the Service. Here are the types
        of information we gather:
      </Typography>
    </Grid>
    <Grid item xs={12}>
      <List
        sx={{
          listStyleType: 'upper-alpha',
          listStylePosition: 'inside',
          fontWeight: 700,
          marginLeft: 5,
        }}
      >
        <ListItem sx={{ display: 'list-item' }}>Information You Give Us</ListItem>
        <Grid item xs={12} ml={-5}>
          <Typography variant="body1" paragraph textAlign="justify">
            <span style={{ fontStyle: 'italic' }}>Company Information:</span>
            {' '}
            When you create an account on the Transparent Path platform, we may
            ask you for certain limited personally identifiable information such as your name, email address
            and phone number, which we will use to contact or identify you. Most of this information is
            recommended but not required to be shared with us and can be adjusted or limited depending
            upon your preferences. You can choose not to provide us with any or all of the information we
            specify or request, but then you may not be able to register with us or to take advantage of
            some or all of our features.
          </Typography>
        </Grid>
        <ListItem sx={{ display: 'list-item' }}>Automatic Information Collected</ListItem>
        <Grid item xs={12} ml={-5}>
          <Typography variant="body1" paragraph textAlign="justify">
            To perform the Service, we also collect information through cookies and other automated
            means. Information of this sort includes:
          </Typography>
        </Grid>
        <Grid item xs={12} ml={-5}>
          <Typography variant="body1" paragraph textAlign="justify">
            <span style={{ fontStyle: 'italic' }}>Technical information about your browser and mobile device:</span>
            {' '}
            This information is used in the
            aggregate to help us optimize the Service for common browsers and devices.
          </Typography>
        </Grid>
        <Grid item xs={12} ml={-5}>
          <Typography variant="body1" paragraph textAlign="justify">
            <span style={{ fontStyle: 'italic' }}>Usage information, such as the features and emails from Transparent Path that you interact with:</span>
            {' '}
            We collect and use this behavioral information and may use it in anonymized and
            aggregate forms to generate statistics about users and how the Services are being used and to
            facilitate targeted communications and advertisements, but the information is not shared in
            any form that could be used to identify you personally.  Please see "How we use and share the
            information we collect," below, for further information and choices about sharing information
            with third parties.
          </Typography>
        </Grid>
        <Grid item xs={12} ml={-5}>
          <Typography variant="body1" paragraph textAlign="justify">
            <span style={{ fontStyle: 'italic' }}>IP address and log file information, cookies, tokens and device identifiers:</span>
            {' '}
            These are
            alphanumeric identifiers that help us to distinguish between unique browsers and devices in
            order to avoid showing you the same information twice, keep you logged into Transparent
            Path, prevent duplicate actions, prevent duplicate coupon redemptions and improve your
            experience. The information we collect from cookies may include your IP address, browser and
            device characteristics, referring URLs, and a record of your interactions with our Service. Most
            Web browsers can be set to inform you when a cookie has been sent to you and provide you
            with the opportunity to refuse that cookie. We will respect your choices relating to on-line
            tracking, whether you choose to reject individual cookies or set your web browser to reject
            cookies and other tracking technology. However, refusing a cookie may, in some cases,
            preclude you from using, or negatively impact the display or function of, the Service or certain
            areas or features of the Service.
          </Typography>
        </Grid>
        <Grid item xs={12} ml={-5}>
          <Typography variant="body1" paragraph textAlign="justify">
            <span style={{ fontStyle: 'italic' }}>Crashes and error reports:</span>
            {' '}
            If you encounter a crash or error while using our Service, we may
            generate a crash report that includes technical, usage and, if you are logged in, your account
            information so that we can diagnose and potentially prevent the problem in the future.
          </Typography>
        </Grid>
      </List>
    </Grid>
    <Grid item xs={12}>
      <Typography className="privacyPolicyHeading">How We Use and Share the Information We Collect</Typography>
    </Grid>
    <Grid item xs={12}>
      <Typography className="privacyPolicyHeading">Use</Typography>
    </Grid>
    <Grid item xs={12}>
      <Typography variant="body1" paragraph textAlign="justify">
        We use the information we collect to establish and manage your account and provide the
        Service to you, including by identifying you on our platform and communicating with you.
      </Typography>
    </Grid>
    <Grid item xs={12}>
      <Typography className="privacyPolicyHeading">Share</Typography>
    </Grid>
    <Grid item xs={12}>
      <Typography variant="body1" paragraph textAlign="justify">
        As an authorized user, you control who can view or access your account. This means that any
        activity conducted through the Service is made available only to you and anyone you expressly
        authorize to access it.
      </Typography>
    </Grid>
    <Grid item xs={12}>
      <Typography variant="body1" paragraph textAlign="justify">
        We will not share your personal information or data except to perform the Services as
        described herein or unless you authorize us to. We may provide aggregate usage and
        demographic reports and information to service partners to help them understand our
        audience and target their communications accordingly, but not in a way that could identify our
        users personally.
      </Typography>
    </Grid>
    <Grid item xs={12}>
      <Typography variant="body1" paragraph textAlign="justify">
        In the normal course of business Transparent Path may share your information with individuals
        (such as employees, contractors and lawyers) and companies (such as consultants and service
        providers such as a push notification delivery service or an artificial intelligence and analytics
        firm) to perform tasks on our behalf and may need to share certain information, including
        images that could be used to identify individuals personally, with them in order to provide
        improved products or services to our users. However, these service providers are bound by
        contractual obligations with us that prevent them from using the information we share with
        them beyond what is necessary to assist us in providing the service to you as described in this
        Privacy Policy.
      </Typography>
    </Grid>
    <Grid item xs={12}>
      <Typography variant="body1" paragraph textAlign="justify">
        Sometimes we may be required to share your information in response to a regulation, court
        order or subpoena. We may also share information when we believe it's necessary to comply
        with the law or to respond to a government request or when we believe disclosure is necessary
        or appropriate to protect the rights, property or safety of Transparent Path, our customers, or
        others; to prevent harm or loss; or in connection with an investigation of suspected or
        actual unlawful activity.
      </Typography>
    </Grid>
    <Grid item xs={12}>
      <Typography variant="body1" paragraph textAlign="justify">
        We may also share your information in the event of a corporate sale, merger, acquisition,
        dissolution, or similar event.
      </Typography>
    </Grid>
    <Grid item xs={12}>
      <Typography className="privacyPolicyHeading">How We Store and Protect the Information We Collect</Typography>
    </Grid>
    <Grid item xs={12}>
      <Typography variant="body1" paragraph textAlign="justify">
        Transparent Path uses reasonable security measures to store and protect the information
        under our control and appropriately limit access to it.  However, we cannot ensure or warrant
        the security of any information you transmit to us, and you do so at your own risk.
      </Typography>
    </Grid>
    <Grid item xs={12}>
      <Typography variant="body1" paragraph textAlign="justify">
        We use a variety of information security measures to protect your online transactions with us.
        The Service uses encryption technology, such as Secure Sockets Layer (SSL), to protect your
        sensitive personal information during data transport.
      </Typography>
    </Grid>
    <Grid item xs={12}>
      <Typography variant="body1" paragraph textAlign="justify">
        We want you to feel confident using the Services. However, no system can be completely
        secure. Therefore, although we take steps to secure your information, we do not promise, and
        you should not expect, that your personally identifiable information, usage data or other
        communications will always remain secure. We will notify you by email if we have reason to
        believe that your personal information has been compromised due to a security breach or used
        in an unauthorized manner, but by using this Service, in accordance with the End User
        Agreement you agree to release us from any and all claims arising out of unauthorized use of
        your information.
      </Typography>
    </Grid>
    <Grid item xs={12}>
      <Typography className="privacyPolicyHeading">Your Choices Regarding the Information We Collect</Typography>
    </Grid>
    <Grid item xs={12}>
      <Typography variant="body1" paragraph textAlign="justify">
        You may choose to:
      </Typography>
    </Grid>
    <Grid item xs={12}>
      <List
        sx={{
          listStyleType: 'disc',
          listStylePosition: 'inside',
        }}
      >
        <ListItem sx={{ display: 'list-item' }}>Update and correct your personal information;</ListItem>
        <ListItem sx={{ display: 'list-item' }}>Object to the processing of your personal information;</ListItem>
        <ListItem sx={{ display: 'list-item' }}>Request to have your personal information or usage data deleted or restricted from our Service;</ListItem>
        <ListItem sx={{ display: 'list-item' }}>Request for portability of your personal information; or</ListItem>
        <ListItem sx={{ display: 'list-item' }}>Cancel your account.</ListItem>
      </List>
    </Grid>
    <Grid item xs={12}>
      <Typography variant="body1" paragraph textAlign="justify">
        To do any of these, simply notify us of this decision by one of these methods:
      </Typography>
    </Grid>
    <Grid item xs={12}>
      <List
        sx={{
          listStyleType: 'disc',
          listStylePosition: 'inside',
        }}
      >
        <ListItem sx={{ display: 'list-item' }}>Follow the unsubscribe link in any marketing email or following the directions included in any other promotional material received from Transparent Path</ListItem>
        <ListItem sx={{ display: 'list-item' }}>
          Send an email to us at
          {' '}
          <Link
            color="primary"
            href="mailto:support@transparentpath.com"
            sx={{
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            support@transparentpath.com
          </Link>
        </ListItem>
      </List>
    </Grid>
    <Grid item xs={12}>
      <Typography className="privacyPolicyHeading">Data Retention</Typography>
    </Grid>
    <Grid item xs={12}>
      <Typography variant="body1" paragraph textAlign="justify">
        We will retain your profile information and usage data for as long as your account is active or as
        needed to provide you services, comply with our legal obligations, resolve disputes, and
        enforce our agreements. In most cases, this period extends to the lifetime of the Company's
        subscription. If the Company closes its account, we may still retain certain information
        associated with the account for analytical purposes and recordkeeping integrity, as well as to
        prevent fraud, collect any fees owed, enforce our terms and conditions, take actions we deem
        necessary to protect the integrity of our web site or our users, or take other actions otherwise
        permitted by law. Deactivating your account does not automatically delete your account or
        usage data from our database, but regardless of any retention policy we will make reasonable
        efforts to enable you to delete your profile and personally identifiable information from our
        database upon request.
      </Typography>
    </Grid>
    <Grid item xs={12}>
      <Typography className="privacyPolicyHeading">Third Party Services and Links to Other Websites</Typography>
    </Grid>
    <Grid item xs={12}>
      <Typography variant="body1" paragraph textAlign="justify">
        Our website may contain links to other websites including those of our service partners and
        other service providers, many of which have their own privacy policies. Be sure to review the
        privacy policy on any site you are visiting, whether directly or through the Service.
      </Typography>
    </Grid>
    <Grid item xs={12}>
      <Typography variant="body1" paragraph textAlign="justify">
        Additionally, we may integrate third party services into our Service in order to personalize your
        experience. This policy only covers the use of cookies by Transparent Path. Cookies placed by
        third party services are governed by the third party terms and privacy policies applicable to
        those services (which we encourage you to read).
      </Typography>
    </Grid>
    <Grid item xs={12}>
      <Typography className="privacyPolicyHeading">Children's Privacy</Typography>
    </Grid>
    <Grid item xs={12}>
      <Typography variant="body1" paragraph textAlign="justify">
        Use of the Service is intended for individuals age 18 and above, and we do not knowingly seek
        or collect personal information from anyone under the age of 18.
      </Typography>
    </Grid>
    <Grid item xs={12}>
      <Typography className="privacyPolicyHeading">Using the Services from outside the United States</Typography>
    </Grid>
    <Grid item xs={12}>
      <Typography variant="body1" paragraph textAlign="justify">
        This Privacy Policy is intended to cover collection of information from residents of the United
        States and is not intended for users located outside the United States. If you are accessing the
        Service from outside the United States, please be aware that your information may be
        transferred to, stored, and processed in the United States where our servers are located and
        our central database is operated. The data protection and other laws of the United States and
        other countries might not be as comprehensive as those in your country. By using the Service,
        you understand that your information may be transferred to our facilities and those third
        parties with whom we share it as described in this Privacy Policy.
      </Typography>
    </Grid>
    <Grid item xs={12}>
      <Typography className="privacyPolicyHeading">Changes to this Privacy Policy</Typography>
    </Grid>
    <Grid item xs={12}>
      <Typography variant="body1" paragraph textAlign="justify">
        Please note that this Privacy Policy may change from time to time. We will post any Privacy
        Policy changes on this page and, if the changes are significant or involve changes to the way we
        use personal information, we will notify you by delivering an announcement via our Service or
        your account email. If you opt out of communications from Transparent Path, you may not
        receive these notifications, however they will still govern your use of the Service, and you are
        responsible for proactively checking for any changes. If you continue to use the Service after
        changes have been posted, you agree to abide by and be bound by the modified privacy
        policy. Each version of this Privacy Policy will be identified by its effective date found at the
        bottom of this page.
      </Typography>
    </Grid>
    <Grid item xs={12}>
      <Typography variant="body1" paragraph textAlign="justify">
        If you have any additional questions or concerns about this Privacy Policy, please feel free to
        contact us any time through this Service or email us at
        {' '}
        <Link
          color="primary"
          href="mailto:support@transparentpath.com"
          sx={{
            textDecoration: 'none',
            '&:hover': {
              textDecoration: 'underline',
            },
          }}
        >
          support@transparentpath.com
        </Link>
        .
      </Typography>
    </Grid>
  </Grid>
);

export default PrivacyPolicy;
