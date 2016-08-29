<!DOCTYPE html>
<html lang="en-US">
<head profile="http://www.w3.org/2005/10/profile">
<link rel="icon" type="image/ico" href="{{ Url::assets('img/logo.png') }}">

    <meta charset="UTF-8">
    <title>{{$title}}</title>
    <link href='http://fonts.googleapis.com/css?family=Raleway:400,700,600' rel='stylesheet' type='text/css'>
    <link rel="stylesheet" href="{{Url::base()}}css/bootstrap.min.css">
    <!--<link rel="stylesheet" id="customCSS" href="{{Url::base()}}css/business-casual.css">-->
     <!--    LOAD CUSTOM STYLES    -->
    <link rel="stylesheet" href="">    
    <script type="text/javascript">
    	baseURL = "{{Url::base()}}";
        tokenString = null;
        userData = null;
    </script>
    <script type="text/javascript" data-main="js/main" src="js/libs/require.js" ></script>
</head>
<body>
<div id="wrapper">
    <div class="brand">Student Information System</div>
    <div class="address-bar">3481 Melrose Place | Beverly Hills, CA 90210 | 123.456.7890</div>

    <!-- Navigation -->
    <nav class="navbar navbar-default" role="navigation">
        <div class="container">
            <!-- Brand and toggle get grouped for better mobile display -->
            <div class="navbar-header">
                <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                <!-- navbar-brand is hidden on larger screens, but visible when the menu is collapsed -->
                <a class="navbar-brand" href="index.html">Business Casual</a>
            </div>
            <!-- Collect the nav links, forms, and other content for toggling -->
            <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                <ul class="nav navbar-nav">
                    <li>
                        <a href="#home">Home</a>
                    </li>
                    <li>
                        <a href="#about">About</a>
                    </li>
                    <li>
                        <a href="#login">Login</a>
                    </li> 
                    <li>
                        <a href="#signup">Sign Up</a>
                    </li>
                    <li>
                        <a href="#contact">Contact</a>
                    </li>
                </ul>
            </div>
            <!-- /.navbar-collapse -->
        </div>
        <!-- /.container -->
    </nav>

    <div id="page-wrapper">
        <div class="container-fluid">
            <div class="container main-body">

            </div>
        </div>
    </div>

    <footer>
        <div class="container">
            <div class="row">
                <div class="col-lg-12 text-center">
                    <p>Copyright &copy; Your Website 2014</p>
                </div>
            </div>
        </div>
    </footer>
    
</div>
<!-- /#wrapper -->

<div id="error-handle-script">
    <!-- place javascript code to handle ajax 401 and 403 errors -->
</div>

<div class="modal fade" id="popup-401" data-keyboard="false" data-backdrop="static">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-body">
        <p class="alert alert-danger">Login is required to access this feature. Please <a class="popup-error-modal" href="{{Url::base()}}#login">login here...</a></p>
      </div>
    </div><!-- /.modal-content -->
  </div><!-- /.modal-dialog -->
</div><!-- /.modal -->

<div class="modal fade" id="popup-403" data-keyboard="false" data-backdrop="static">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-body">
        <p class="alert alert-danger">Reastricted access to this feature. Please <a class="popup-error-modal" href="{{Url::base()}}#login">login here...</a></p>
      </div>
    </div><!-- /.modal-content -->
  </div><!-- /.modal-dialog -->
</div><!-- /.modal -->
</body>
</html>



